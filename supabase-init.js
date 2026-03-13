/* ══════════════════════════════════════════════════════════════════════
   NutriSaúde — Configuração Supabase
   ══════════════════════════════════════════════════════════════════════
   INSTRUÇÕES:
   1. Acesse supabase.com e faça login no seu projeto
   2. Vá em: Settings → API
   3. Copie "Project URL" e cole em SUPA_URL
   4. Copie "anon public" key e cole em SUPA_KEY
   ══════════════════════════════════════════════════════════════════════ */

const SUPA_URL = 'https://thsaxtvyubebtsgnntns.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoc2F4dHZ5dWJlYnRzZ25udG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjcxMTYsImV4cCI6MjA4ODkwMzExNn0.XRTy9SWvcQYo_kVl8AHMOzhDlhLFdnK2AUp8NWnrS2Y';

// Valida se as chaves foram configuradas
if (SUPA_URL.includes('COLE_') || SUPA_KEY.includes('COLE_')) {
  console.warn('[NutriSaúde] ⚠️ Configure supabase-init.js com sua URL e chave do Supabase.');
}

const _supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
  }
});
