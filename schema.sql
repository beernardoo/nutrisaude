-- ══════════════════════════════════════════════════════════════════════
-- NutriSaúde — Schema Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- supabase.com → seu projeto → SQL Editor → New Query → Cole e Execute
-- ══════════════════════════════════════════════════════════════════════

-- ── Perfil do paciente (1-to-1 com auth.users) ─────────────────────────
CREATE TABLE IF NOT EXISTS perfil (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT,
  nascimento  DATE,
  medico      TEXT,
  crm         TEXT,
  glp1_ativo  BOOLEAN DEFAULT false,
  glp1_tipo   TEXT,
  glp1_dose   TEXT,
  glp1_freq   TEXT,
  glp1_inicio DATE,
  uso_meds    JSONB DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Medicamentos ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicamentos (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome      TEXT NOT NULL,
  dosagem   TEXT,
  freq      TEXT,
  inicio    DATE,
  obs       TEXT,
  reg_por   TEXT DEFAULT 'Paciente',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ── Exames Laboratoriais ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exames (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo       TEXT NOT NULL,
  nome       TEXT NOT NULL,
  resultado  NUMERIC NOT NULL,
  unidade    TEXT,
  referencia TEXT,
  status     TEXT DEFAULT 'normal',
  data       DATE,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Plano Alimentar (1-to-1 com user) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS plano_alimentar (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dados      JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- Row Level Security — cada usuário acessa APENAS seus próprios dados
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE perfil          ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamentos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames          ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_alimentar ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "own_perfil"       ON perfil          FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_medicamentos" ON medicamentos    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_exames"       ON exames          FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_plano"        ON plano_alimentar FOR ALL USING (auth.uid() = id);

-- ══════════════════════════════════════════════════════════════════════
-- Trigger: atualiza updated_at automaticamente
-- ══════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_perfil_updated
  BEFORE UPDATE ON perfil
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_plano_updated
  BEFORE UPDATE ON plano_alimentar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
