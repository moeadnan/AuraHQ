-- AURA HQ — Agentic Features
-- Run in Supabase SQL editor after 002_agentic.sql

-- ── Status text on agents ───────────────────────────────────────────────────
-- One-line current state string generated after each session.
-- Shown on HQ cards in place of "X days ago".

ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS status_text TEXT;

-- ── Agent watches ───────────────────────────────────────────────────────────
-- Forward-looking flags the agent sets during a session.
-- "I'm watching whether X happens — check this next time."

CREATE TABLE public.agent_watches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watches"
  ON public.agent_watches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watches"
  ON public.agent_watches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watches"
  ON public.agent_watches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own watches"
  ON public.agent_watches FOR DELETE USING (auth.uid() = user_id);

-- ── Agent artifacts ─────────────────────────────────────────────────────────
-- Living documents the agent maintains across sessions.
-- voice_model (Manuscript), pattern_registry (Grain), negotiation_context (Terms).
-- One artifact per type per agent (upsert on update).

CREATE TABLE public.agent_artifacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artifact_type TEXT NOT NULL,   -- 'voice_model' | 'pattern_registry' | 'negotiation_context'
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, artifact_type)
);

ALTER TABLE public.agent_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own artifacts"
  ON public.agent_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own artifacts"
  ON public.agent_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own artifacts"
  ON public.agent_artifacts FOR UPDATE USING (auth.uid() = user_id);

-- ── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX agent_watches_agent_id ON public.agent_watches (agent_id, resolved, created_at DESC);
CREATE INDEX agent_artifacts_agent_id ON public.agent_artifacts (agent_id, artifact_type);
