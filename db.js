/* ══════════════════════════════════════════════════════════════════════
   NutriSaúde — Camada de Banco de Dados (db.js)
   Substitui localStorage. Todas as operações são assíncronas via Supabase.
   ══════════════════════════════════════════════════════════════════════ */

/* ── Helper: obtém user_id atual ────────────────────────────────────── */
async function dbUserId() {
  const { data: { user } } = await _supabase.auth.getUser();
  return user?.id ?? null;
}

/* ── Helper: log de erros amigável ─────────────────────────────────── */
function dbErro(operacao, error) {
  console.error(`[DB] Erro em ${operacao}:`, error?.message || error);
}

/* ══════════════════════════════════════════════════════════════════════
   CARREGAMENTO INICIAL — substitui localStorage no init()
   ══════════════════════════════════════════════════════════════════════ */
async function carregarDados() {
  const uid = await dbUserId();
  if (!uid) return;

  try {
    // Carrega em paralelo para melhor performance
    const [resMeds, resExames, resPerfil, resPlano] = await Promise.all([
      _supabase.from('medicamentos').select('*').eq('user_id', uid).order('criado_em', { ascending: true }),
      _supabase.from('exames').select('*').eq('user_id', uid).order('data', { ascending: false }),
      _supabase.from('perfil').select('*').eq('id', uid).maybeSingle(),
      _supabase.from('plano_alimentar').select('dados').eq('id', uid).maybeSingle(),
    ]);

    // ── Medicamentos ──────────────────────────────────────────────────
    medicamentos.length = 0;
    (resMeds.data || []).forEach(m => medicamentos.push({
      id:     m.id,
      nome:   m.nome,
      dosagem:m.dosagem || '',
      freq:   m.freq    || '',
      inicio: m.inicio  || '',
      obs:    m.obs     || '',
      regPor: m.reg_por || 'Paciente',
    }));

    // ── Exames ────────────────────────────────────────────────────────
    exames.length = 0;
    (resExames.data || []).forEach(e => exames.push({
      id:         e.id,
      tipo:       e.tipo,
      nome:       e.nome,
      resultado:  Number(e.resultado),
      unidade:    e.unidade    || '',
      referencia: e.referencia || '',
      status:     e.status     || 'normal',
      data:       e.data       || '',
    }));

    // ── Perfil ────────────────────────────────────────────────────────
    Object.keys(perfil).forEach(k => delete perfil[k]);
    const p = resPerfil.data;
    if (p) {
      Object.assign(perfil, {
        nome:        p.nome        || '',
        nascimento:  p.nascimento  || '',
        medico:      p.medico      || '',
        crm:         p.crm         || '',
        // Dados biométricos
        sexo:        p.sexo        || '',
        peso:        p.peso        || null,
        altura:      p.altura      || null,
        cintura:     p.cintura     || null,
        atividade:   p.atividade   || '',
        objetivo:    p.objetivo    || '',
        imc:         p.imc         || null,
        // GLP-1
        glp1Ativo:   p.glp1_ativo  || false,
        glp1Tipo:    p.glp1_tipo   || '',
        glp1Dose:    p.glp1_dose   || '',
        glp1Freq:    p.glp1_freq   || '',
        glp1Inicio:  p.glp1_inicio || '',
      });
      // Recarrega uso de meds
      usoMeds.length = 0;
      (p.uso_meds || []).forEach(m => usoMeds.push(m));
    }

    // ── Plano alimentar ───────────────────────────────────────────────
    Object.keys(plano).forEach(k => delete plano[k]);
    if (resPlano.data?.dados) {
      Object.assign(plano, resPlano.data.dados);
      localStorage.setItem('ns_plano_paciente', JSON.stringify(plano)); // mantém cache sincronizado
    }

    // Re-renderiza tudo
    if (typeof renderMedicamentos === 'function') renderMedicamentos();
    if (typeof renderExames       === 'function') renderExames();
    if (typeof carregarPerfil     === 'function') carregarPerfil();
    if (typeof renderPlano        === 'function') renderPlano();
    if (typeof calcularMetas      === 'function') calcularMetas();

  } catch(err) {
    dbErro('carregarDados', err);
  }
}

/* ══════════════════════════════════════════════════════════════════════
   PERFIL
   ══════════════════════════════════════════════════════════════════════ */
async function dbSalvarPerfil(obj) {
  const uid = await dbUserId();
  if (!uid) return;

  // Calcula e salva IMC se peso e altura disponíveis
  let imcVal = null;
  if (obj.peso && obj.altura) {
    const altM = obj.altura / 100;
    imcVal = parseFloat((obj.peso / (altM * altM)).toFixed(1));
  }

  const { error } = await _supabase.from('perfil').upsert({
    id:          uid,
    nome:        obj.nome        || null,
    nascimento:  obj.nascimento  || null,
    medico:      obj.medico      || null,
    crm:         obj.crm         || null,
    // Dados biométricos
    sexo:        obj.sexo        || null,
    peso:        obj.peso        || null,
    altura:      obj.altura      || null,
    cintura:     obj.cintura     || null,
    atividade:   obj.atividade   || null,
    objetivo:    obj.objetivo    || null,
    imc:         imcVal,
    // GLP-1
    glp1_ativo:  obj.glp1Ativo   || false,
    glp1_tipo:   obj.glp1Tipo    || null,
    glp1_dose:   obj.glp1Dose    || null,
    glp1_freq:   obj.glp1Freq    || null,
    glp1_inicio: obj.glp1Inicio  || null,
    uso_meds:    obj.usoMeds     || [],
  }, { onConflict: 'id' });
  if (error) dbErro('dbSalvarPerfil', error);
}

/* ══════════════════════════════════════════════════════════════════════
   MEDICAMENTOS
   ══════════════════════════════════════════════════════════════════════ */
async function dbInserirMedicamento(obj, uidPreFetchado) {
  const uid = uidPreFetchado || await dbUserId();
  if (!uid) return null;
  const { data, error } = await _supabase.from('medicamentos').insert({
    user_id: uid,
    nome:    obj.nome,
    dosagem: obj.dosagem || null,
    freq:    obj.freq    || null,
    inicio:  obj.inicio  || null,
    obs:     obj.obs     || null,
    reg_por: obj.regPor  || 'Paciente',
  }).select().single();
  if (error) { dbErro('dbInserirMedicamento', error); return null; }
  return data?.id ?? null;   // retorna o UUID gerado pelo Supabase
}

async function dbRemoverMedicamento(id) {
  const uid = await dbUserId();
  if (!uid) return;
  const { error } = await _supabase.from('medicamentos')
    .delete().eq('id', id).eq('user_id', uid);
  if (error) dbErro('dbRemoverMedicamento', error);
}

/* ══════════════════════════════════════════════════════════════════════
   EXAMES
   ══════════════════════════════════════════════════════════════════════ */
async function dbInserirExame(obj, uidPreFetchado) {
  const uid = uidPreFetchado || await dbUserId();
  if (!uid) return null;
  const { data, error } = await _supabase.from('exames').insert({
    user_id:    uid,
    tipo:       obj.tipo,
    nome:       obj.nome,
    resultado:  obj.resultado,
    unidade:    obj.unidade    || null,
    referencia: obj.referencia || null,
    status:     obj.status     || 'normal',
    data:       obj.data       || null,
  }).select().single();
  if (error) { dbErro('dbInserirExame', error); return null; }
  return data?.id ?? null;
}

async function dbRemoverExame(id) {
  const uid = await dbUserId();
  if (!uid) return;
  const { error } = await _supabase.from('exames')
    .delete().eq('id', id).eq('user_id', uid);
  if (error) dbErro('dbRemoverExame', error);
}

/* ══════════════════════════════════════════════════════════════════════
   PLANO ALIMENTAR
   ══════════════════════════════════════════════════════════════════════ */
async function dbSalvarPlano(dadosPlano) {
  // Backup local imediato — garante persistência mesmo offline
  localStorage.setItem('ns_plano_paciente', JSON.stringify(dadosPlano));
  const uid = await dbUserId();
  if (!uid) return;
  const { error } = await _supabase.from('plano_alimentar').upsert(
    { id: uid, dados: dadosPlano },
    { onConflict: 'id' }
  );
  if (error) dbErro('dbSalvarPlano', error);
}
