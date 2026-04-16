-- AURA HQ — Agentic Infrastructure
-- Run this in your Supabase SQL editor after 001_initial.sql

-- ── OAuth connections ──────────────────────────────────────────────────────
-- Stores OAuth tokens for external service integrations per user.
-- One row per user per provider. Tokens stored in plain text (Supabase
-- encrypts at rest; RLS ensures users can only see their own rows).

CREATE TABLE public.oauth_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,            -- 'google'
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  connected_email TEXT,              -- which account was authorized
  scopes TEXT,                       -- space-separated granted scopes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- ── Conversation history ───────────────────────────────────────────────────
-- Full message history per agent session. Passed to the model on every
-- request so the agent remembers what was said earlier in the session.

CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,                -- 'user' | 'assistant' | 'tool'
  content TEXT NOT NULL,
  tool_call_id TEXT,                 -- for tool result messages
  tool_name TEXT,                    -- for tool result messages
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tool call log ──────────────────────────────────────────────────────────
-- Transparency log of every tool the agent called, what arguments it used,
-- and what came back. Shown to the user in the workspace.

CREATE TABLE public.tool_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  arguments JSONB,
  result_summary TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_calls ENABLE ROW LEVEL SECURITY;

-- oauth_connections
CREATE POLICY "Users can view own connections"
  ON public.oauth_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections"
  ON public.oauth_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connections"
  ON public.oauth_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections"
  ON public.oauth_connections FOR DELETE USING (auth.uid() = user_id);

-- conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- tool_calls
CREATE POLICY "Users can view own tool calls"
  ON public.tool_calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tool calls"
  ON public.tool_calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Index for conversation history queries ─────────────────────────────────
CREATE INDEX conversations_agent_id_created_at
  ON public.conversations (agent_id, created_at DESC);
