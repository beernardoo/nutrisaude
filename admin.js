/* ══════════════════════════════════════════════════════════════════════
   NutriSaúde — admin.js
   Painel administrativo: visível apenas para o usuário master.
   ══════════════════════════════════════════════════════════════════════ */

const ADMIN_EMAIL = 'beer_nar_doo@hotmail.com';

/* ── Verifica se o usuário logado é admin ────────────────────────── */
async function adminVerificar() {
  const { data: { session } } = await _supabase.auth.getSession();
  const email = session?.user?.email || '';
  const btn = document.getElementById('tab-btn-admin');
  if (btn) btn.style.display = (email === ADMIN_EMAIL) ? '' : 'none';
}

/* ── Carrega lista de todos os pacientes ─────────────────────────── */
async function adminCarregarPacientes() {
  const loading = document.getElementById('admin-loading');
  const lista   = document.getElementById('admin-lista-pacientes');
  if (!loading || !lista) return;

  loading.style.display = 'block';
  lista.innerHTML = '';
  adminFecharDetalhe();

  // Busca todos os perfis (requer política RLS de admin no Supabase)
  const { data: perfis, error } = await _supabase
    .from('perfil')
    .select('*')
    .order('nome', { ascending: true });

  loading.style.display = 'none';

  if (error) {
    lista.innerHTML = `<p style="color:var(--danger)">❌ Erro ao carregar pacientes: ${error.message}<br><small>Verifique se as políticas RLS do admin foram criadas no Supabase.</small></p>`;
    return;
  }

  if (!perfis || perfis.length === 0) {
    lista.innerHTML = '<p style="color:var(--text-muted)">Nenhum paciente cadastrado ainda.</p>';
    return;
  }

  const linhas = perfis.map(p => `
    <tr style="cursor:pointer" onclick="adminVerPaciente('${p.id}','${(p.nome||'Sem nome').replace(/'/g,"\\'")}')">
      <td>${p.nome || '<em>—</em>'}</td>
      <td>${p.nascimento || '—'}</td>
      <td>${p.medico || '—'}</td>
      <td>${p.glp1_ativo ? '✅ Sim' : 'Não'}</td>
      <td><button class="btn btn-outline" style="font-size:12px;padding:4px 10px" onclick="event.stopPropagation();adminVerPaciente('${p.id}','${(p.nome||'Sem nome').replace(/'/g,"\\'")}')">Ver dados</button></td>
    </tr>
  `).join('');

  lista.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr style="background:var(--primary);color:#fff;text-align:left">
          <th style="padding:10px">Nome</th>
          <th style="padding:10px">Nascimento</th>
          <th style="padding:10px">Médico</th>
          <th style="padding:10px">GLP-1</th>
          <th style="padding:10px">Ação</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
    <p style="margin-top:8px;font-size:12px;color:var(--text-muted)">${perfis.length} paciente${perfis.length !== 1 ? 's' : ''} cadastrado${perfis.length !== 1 ? 's' : ''}</p>
  `;
}

/* ── Abre detalhes de um paciente ───────────────────────────────── */
async function adminVerPaciente(uid, nome) {
  const detalhe = document.getElementById('admin-detalhe');
  const titulo  = document.getElementById('admin-detalhe-titulo');
  const corpo   = document.getElementById('admin-detalhe-corpo');
  if (!detalhe || !titulo || !corpo) return;

  titulo.textContent = `📋 ${nome}`;
  corpo.innerHTML = '<p style="color:var(--text-muted)">⏳ Carregando dados...</p>';
  detalhe.style.display = 'block';
  detalhe.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Carrega exames e medicamentos do paciente
  const [resExames, resMeds] = await Promise.all([
    _supabase.from('exames').select('*').eq('user_id', uid).order('data', { ascending: false }),
    _supabase.from('medicamentos').select('*').eq('user_id', uid).order('criado_em', { ascending: true }),
  ]);

  const examesHtml = (resExames.data || []).length === 0
    ? '<p style="color:var(--text-muted)">Nenhum exame registrado.</p>'
    : `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">
        <thead><tr style="background:var(--surface-2)">
          <th style="padding:8px;text-align:left">Exame</th>
          <th style="padding:8px;text-align:left">Resultado</th>
          <th style="padding:8px;text-align:left">Status</th>
          <th style="padding:8px;text-align:left">Data</th>
        </tr></thead>
        <tbody>${(resExames.data || []).map(e => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:7px">${e.nome}</td>
            <td style="padding:7px">${e.resultado} ${e.unidade || ''}</td>
            <td style="padding:7px"><span style="color:${e.status==='normal'?'var(--success)':e.status==='atencao'?'var(--warning)':'var(--danger)'}">${e.status}</span></td>
            <td style="padding:7px">${e.data || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  const medsHtml = (resMeds.data || []).length === 0
    ? '<p style="color:var(--text-muted)">Nenhum medicamento registrado.</p>'
    : `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">
        <thead><tr style="background:var(--surface-2)">
          <th style="padding:8px;text-align:left">Medicamento</th>
          <th style="padding:8px;text-align:left">Dosagem</th>
          <th style="padding:8px;text-align:left">Frequência</th>
        </tr></thead>
        <tbody>${(resMeds.data || []).map(m => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:7px">${m.nome}</td>
            <td style="padding:7px">${m.dosagem || '—'}</td>
            <td style="padding:7px">${m.freq || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  corpo.innerHTML = `
    <div style="margin-bottom:20px">
      <h4 style="margin:0 0 8px;color:var(--primary)">🔬 Exames (${(resExames.data||[]).length})</h4>
      ${examesHtml}
    </div>
    <div>
      <h4 style="margin:0 0 8px;color:var(--primary)">💊 Medicamentos (${(resMeds.data||[]).length})</h4>
      ${medsHtml}
    </div>
  `;
}

function adminFecharDetalhe() {
  const el = document.getElementById('admin-detalhe');
  if (el) el.style.display = 'none';
}

/* ── Inicializa quando o DOM carrega ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Escuta mudanças de sessão para mostrar/ocultar tab admin
  _supabase.auth.onAuthStateChange(async (event, session) => {
    const email = session?.user?.email || '';
    const btn = document.getElementById('tab-btn-admin');
    if (btn) btn.style.display = (email === ADMIN_EMAIL) ? '' : 'none';
    // Carrega pacientes automaticamente ao entrar na tab admin
    if (email === ADMIN_EMAIL && event === 'SIGNED_IN') {
      // Pequeno delay para garantir que o DOM do tab esteja pronto
      setTimeout(adminCarregarPacientes, 500);
    }
  });
});
