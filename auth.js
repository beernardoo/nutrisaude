/* ══════════════════════════════════════════════════════════════════════
   NutriSaúde — Autenticação (auth.js)
   Gerencia login, cadastro, sessão e logout via Supabase Auth.
   ══════════════════════════════════════════════════════════════════════ */

/* ── Injeta o HTML do overlay no topo do body ──────────────────────── */
(function criarOverlay() {
  const html = `
  <div id="auth-overlay" class="auth-overlay" style="display:none">
    <div class="auth-card">

      <!-- Logo / Título -->
      <div class="auth-logo">
        <span class="auth-logo-icon">🥗</span>
        <h1 class="auth-logo-titulo">NutriSaúde</h1>
        <p class="auth-logo-sub">Gestão Nutricional &amp; Medicamentos</p>
      </div>

      <!-- Abas -->
      <div class="auth-tabs">
        <button class="auth-tab active" id="tab-login"    onclick="authMostrarAba('login')">Entrar</button>
        <button class="auth-tab"        id="tab-cadastro" onclick="authMostrarAba('cadastro')">Criar conta</button>
      </div>

      <!-- ── ABA: Login ── -->
      <form id="auth-form-login" class="auth-form" onsubmit="authLogin(event)">
        <div class="auth-field">
          <label>E-mail</label>
          <input type="email" id="login-email" placeholder="seu@email.com" required autocomplete="email" />
        </div>
        <div class="auth-field">
          <label>Senha</label>
          <input type="password" id="login-senha" placeholder="••••••••" required autocomplete="current-password" />
        </div>
        <div id="login-msg" class="auth-msg" style="display:none"></div>
        <button type="submit" class="auth-btn" id="login-btn">
          <span class="auth-btn-txt">Entrar</span>
          <span class="auth-btn-spin" style="display:none">⏳</span>
        </button>
      </form>

      <!-- ── ABA: Cadastro ── -->
      <form id="auth-form-cadastro" class="auth-form" onsubmit="authCadastro(event)" style="display:none">
        <div class="auth-field">
          <label>Nome completo</label>
          <input type="text" id="cad-nome" placeholder="Seu nome" required />
        </div>
        <div class="auth-field">
          <label>E-mail</label>
          <input type="email" id="cad-email" placeholder="seu@email.com" required autocomplete="email" />
        </div>
        <div class="auth-field">
          <label>Senha <small>(mínimo 6 caracteres)</small></label>
          <input type="password" id="cad-senha" placeholder="••••••••" required minlength="6" autocomplete="new-password" />
        </div>
        <div class="auth-field">
          <label>Confirmar senha</label>
          <input type="password" id="cad-confirma" placeholder="••••••••" required autocomplete="new-password" />
        </div>
        <div id="cadastro-msg" class="auth-msg" style="display:none"></div>
        <button type="submit" class="auth-btn" id="cadastro-btn">
          <span class="auth-btn-txt">Criar conta</span>
          <span class="auth-btn-spin" style="display:none">⏳</span>
        </button>
      </form>

    </div>
  </div>

  <!-- Toast migração localStorage -->
  <div id="migration-toast" class="migration-toast" style="display:none">
    <div class="migration-content">
      <span>📦 Encontramos dados locais neste dispositivo. Deseja importá-los para sua conta?</span>
      <div class="migration-btns">
        <button class="btn btn-primary" onclick="migrarLocalStorage()">✅ Importar</button>
        <button class="btn btn-outline" onclick="descartarMigracao()">Ignorar</button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', html);
})();

/* ── Controle de abas ──────────────────────────────────────────────── */
function authMostrarAba(aba) {
  document.getElementById('auth-form-login').style.display    = aba === 'login'    ? 'flex' : 'none';
  document.getElementById('auth-form-cadastro').style.display = aba === 'cadastro' ? 'flex' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    aba === 'login');
  document.getElementById('tab-cadastro').classList.toggle('active', aba === 'cadastro');
  authLimparMsgs();
}

function authLimparMsgs() {
  ['login-msg','cadastro-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; el.className = 'auth-msg'; }
  });
}

function authSetMsg(id, tipo, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent  = msg;
  el.className    = `auth-msg auth-msg-${tipo}`;
  el.style.display = 'block';
}

function authSetLoading(btnId, spinId, loading) {
  const btn  = document.getElementById(btnId);
  const spin = document.getElementById(spinId);
  if (!btn) return;
  btn.disabled = loading;
  btn.querySelector('.auth-btn-txt').style.opacity = loading ? '0.5' : '1';
  if (spin) spin.style.display = loading ? 'inline' : 'none';
}

/* ── Login ─────────────────────────────────────────────────────────── */
async function authLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  authLimparMsgs();
  authSetLoading('login-btn', null, true);

  const { data, error } = await _supabase.auth.signInWithPassword({ email, password: senha });

  authSetLoading('login-btn', null, false);

  if (error) {
    const msgs = {
      'Invalid login credentials': '❌ E-mail ou senha incorretos.',
      'Email not confirmed':        '📧 Confirme seu e-mail antes de entrar.',
    };
    authSetMsg('login-msg', 'erro', msgs[error.message] || '❌ ' + error.message);
    return;
  }

  await authOnLogin(data.user);
}

/* ── Cadastro ──────────────────────────────────────────────────────── */
async function authCadastro(e) {
  e.preventDefault();
  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const senha    = document.getElementById('cad-senha').value;
  const confirma = document.getElementById('cad-confirma').value;

  authLimparMsgs();

  if (senha !== confirma) {
    authSetMsg('cadastro-msg', 'erro', '❌ As senhas não coincidem.');
    return;
  }
  if (senha.length < 6) {
    authSetMsg('cadastro-msg', 'erro', '❌ Senha deve ter pelo menos 6 caracteres.');
    return;
  }

  authSetLoading('cadastro-btn', null, true);

  const { data, error } = await _supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } }
  });

  authSetLoading('cadastro-btn', null, false);

  if (error) {
    const msgs = {
      'User already registered': '❌ Este e-mail já está cadastrado. Faça login.',
    };
    authSetMsg('cadastro-msg', 'erro', msgs[error.message] || '❌ ' + error.message);
    return;
  }

  // Cria perfil inicial
  if (data.user) {
    await _supabase.from('perfil').upsert({
      id:   data.user.id,
      nome: nome,
    }, { onConflict: 'id' });
  }

  // Supabase pode confirmar e-mail automaticamente (dependendo da config do projeto)
  if (data.session) {
    await authOnLogin(data.user);
  } else {
    authSetMsg('cadastro-msg', 'ok',
      '✅ Conta criada! Verifique seu e-mail para confirmar o cadastro, depois faça login.');
    authMostrarAba('login');
    document.getElementById('login-email').value = email;
  }
}

/* ── Ações pós-login ───────────────────────────────────────────────── */
async function authOnLogin(user) {
  authOcultarOverlay();
  atualizarHeaderUsuario(user.email);
  await carregarDados();        // db.js
  verificarMigracaoLocalStorage();
  if (typeof adminVerificar === 'function') adminVerificar();
}

/* ── Logout ────────────────────────────────────────────────────────── */
function authLogout() {
  // Limpa UI imediatamente — sem await, sem esperar rede
  if (typeof medicamentos !== 'undefined') { medicamentos.length = 0; }
  if (typeof exames       !== 'undefined') { exames.length = 0; }
  if (typeof plano        !== 'undefined') { Object.keys(plano).forEach(k => delete plano[k]); }
  if (typeof perfil       !== 'undefined') { Object.keys(perfil).forEach(k => delete perfil[k]); }
  if (typeof usoMeds      !== 'undefined') { usoMeds.length = 0; }

  if (typeof renderMedicamentos === 'function') renderMedicamentos();
  if (typeof renderExames       === 'function') renderExames();
  if (typeof renderPlano        === 'function') renderPlano();

  atualizarHeaderUsuario('');
  authExibirOverlay();

  // signOut em background — não bloqueia a UI
  _supabase.auth.signOut().catch(() => {});
}

/* ── Verificação de sessão ao carregar ─────────────────────────────── */
async function authVerificarSessao() {
  const { data: { session } } = await _supabase.auth.getSession();
  if (session?.user) {
    authOcultarOverlay();
    atualizarHeaderUsuario(session.user.email);
    await carregarDados();
    verificarMigracaoLocalStorage();
  } else {
    authExibirOverlay();
  }

  // Escuta mudanças de sessão (ex: confirmação de e-mail em outra aba)
  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      authOcultarOverlay();
      atualizarHeaderUsuario(session.user.email);
      await carregarDados();
    } else if (event === 'SIGNED_OUT') {
      authExibirOverlay();
    }
  });
}

/* ── Helpers de overlay ────────────────────────────────────────────── */
function authExibirOverlay() {
  const el = document.getElementById('auth-overlay');
  if (el) el.style.display = 'flex';
}

function authOcultarOverlay() {
  const el = document.getElementById('auth-overlay');
  if (el) el.style.display = 'none';
}

function atualizarHeaderUsuario(email) {
  const el = document.getElementById('user-email-display');
  if (el) el.textContent = email || '';
}

/* ── Migração de dados do localStorage — desativado ─────────────────── */
function verificarMigracaoLocalStorage() {
  // Limpa silenciosamente chaves antigas sem exibir toast
  ['ns_medicamentos','ns_exames','ns_perfil','ns_plano','ns_uso_meds']
    .forEach(k => localStorage.removeItem(k));
}

async function migrarLocalStorage() {
  const toast = document.getElementById('migration-toast');
  if (toast) toast.style.display = 'none';

  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) return;

  let importados = 0;

  // Medicamentos
  try {
    const meds = JSON.parse(localStorage.getItem('ns_medicamentos') || '[]');
    for (const m of meds) {
      await _supabase.from('medicamentos').insert({
        user_id: user.id, nome: m.nome, dosagem: m.dosagem,
        freq: m.freq, inicio: m.inicio || null, obs: m.obs, reg_por: m.regPor || 'Paciente'
      });
      importados++;
    }
  } catch(_) {}

  // Exames
  try {
    const exs = JSON.parse(localStorage.getItem('ns_exames') || '[]');
    for (const ex of exs) {
      await _supabase.from('exames').insert({
        user_id: user.id, tipo: ex.tipo, nome: ex.nome,
        resultado: ex.resultado, unidade: ex.unidade,
        referencia: ex.referencia, status: ex.status, data: ex.data || null
      });
      importados++;
    }
  } catch(_) {}

  // Perfil
  try {
    const p = JSON.parse(localStorage.getItem('ns_perfil') || 'null');
    const u = JSON.parse(localStorage.getItem('ns_uso_meds') || '[]');
    if (p) {
      await _supabase.from('perfil').upsert({
        id: user.id, nome: p.nome, nascimento: p.nascimento || null,
        medico: p.medico, crm: p.crm,
        glp1_ativo: p.glp1Ativo || false, glp1_tipo: p.glp1Tipo,
        glp1_dose: p.glp1Dose, glp1_freq: p.glp1Freq, glp1_inicio: p.glp1Inicio || null,
        uso_meds: u
      }, { onConflict: 'id' });
      importados++;
    }
  } catch(_) {}

  // Plano
  try {
    const pl = JSON.parse(localStorage.getItem('ns_plano') || 'null');
    if (pl && Object.keys(pl).length) {
      await _supabase.from('plano_alimentar').upsert(
        { id: user.id, dados: pl },
        { onConflict: 'id' }
      );
      importados++;
    }
  } catch(_) {}

  // Limpa localStorage após migração
  ['ns_medicamentos','ns_exames','ns_perfil','ns_plano','ns_uso_meds'].forEach(k =>
    localStorage.removeItem(k)
  );

  // Recarrega dados do Supabase
  await carregarDados();
  mostrarToastMigracao(`✅ ${importados} registro${importados !== 1 ? 's' : ''} importado${importados !== 1 ? 's' : ''} com sucesso!`);
}

function descartarMigracao() {
  const toast = document.getElementById('migration-toast');
  if (toast) toast.style.display = 'none';
  ['ns_medicamentos','ns_exames','ns_perfil','ns_plano','ns_uso_meds'].forEach(k =>
    localStorage.removeItem(k)
  );
}

function mostrarToastMigracao(msg) {
  const toast = document.getElementById('migration-toast');
  if (!toast) return;
  toast.querySelector('.migration-content span').textContent = msg;
  toast.querySelector('.migration-btns').style.display = 'none';
  toast.style.display = 'flex';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

/* ── Inicia verificação quando o DOM estiver pronto ─────────────────── */
document.addEventListener('DOMContentLoaded', authVerificarSessao);
