-- Enable Vector Extension for RAG
create extension if not exists vector;

-- 1. PROFILES (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DOCUMENTS (RAG Knowledge Base)
create table documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  file_path text not null, -- Storage path
  content text,            -- Raw text for fallback
  embedding vector(384),   -- Transformers.js embedding
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROOMS (Real-time Collaboration)
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references profiles(id) on delete set null,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SKILLS (Gamification Tree)
create table skills (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  category text not null, -- 'frontend', 'backend', 'ai'
  parents uuid[] default '{}', -- Adjacency list for DAG
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_skills (
  user_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  status text check (status in ('locked', 'unlocked', 'mastered')),
  primary key (user_id, skill_id)
);

-- PILLAR 4: SECURITY Policies (RLS)
alter table profiles enable row level security;
alter table documents enable row level security;
alter table rooms enable row level security;
alter table skills enable row level security;
alter table user_skills enable row level security;

-- Profiles
create policy "Public Read" on profiles for select using (true);
create policy "Self Update" on profiles for update using (auth.uid() = id);

-- Documents
create policy "Private Data" on documents using (auth.uid() = user_id);

-- Rooms
create policy "Public Join" on rooms for select using (true);

-- Skills
create policy "Public Read" on skills for select using (true);
