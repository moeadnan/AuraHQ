-- AURA HQ Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT,                        -- onboarding Q1: primary role
  support_area TEXT,                -- onboarding Q2: area needing support
  capacity_answer TEXT,             -- onboarding Q3: what they'd do with more mental capacity
  avatar_url TEXT,                  -- URL to generated avatar in Supabase storage
  avatar_fallback_used BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'trial', -- trial | active | expired
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table
CREATE TABLE public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,               -- user-given name (max 30 chars)
  domain TEXT NOT NULL,             -- Work | Money | Personal Growth
  agent_type TEXT NOT NULL,         -- Manuscript | Counsel | Dispatch | Ledger | Horizon | Terms | Mirror | Grain | Meridian
  purpose TEXT NOT NULL,            -- user-written purpose (max 120 chars)
  seed_answer_1 TEXT,               -- seeding question 1 answer
  seed_answer_2 TEXT,               -- seeding question 2 answer
  seed_answer_3 TEXT,               -- seeding question 3 answer
  last_used_at TIMESTAMPTZ,
  position_index INTEGER DEFAULT 0, -- order in HQ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory items table (max 25 per agent)
CREATE TABLE public.memory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'confirmed',  -- seed | confirmed | auto
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Output cards table (persisted across sessions)
CREATE TABLE public.output_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  capability TEXT NOT NULL,
  user_input TEXT NOT NULL,
  output_text TEXT NOT NULL,
  saved_to_memory BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.output_cards ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Agents RLS
CREATE POLICY "Users can view own agents"
  ON public.agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own agents"
  ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents"
  ON public.agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents"
  ON public.agents FOR DELETE USING (auth.uid() = user_id);

-- Memory items RLS
CREATE POLICY "Users can view own memory"
  ON public.memory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memory"
  ON public.memory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own memory"
  ON public.memory_items FOR DELETE USING (auth.uid() = user_id);

-- Output cards RLS
CREATE POLICY "Users can view own cards"
  ON public.output_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards"
  ON public.output_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards"
  ON public.output_cards FOR UPDATE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Storage RLS for avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
