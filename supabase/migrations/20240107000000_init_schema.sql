-- Enable Vector Extension for RAG
create extension if not exists vector;

-- 1. PROFILES (Extends Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DOCUMENTS (Parent table for files)
create table if not exists documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  file_path text not null, -- Storage path
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.5 DOCUMENT SECTIONS (Chunks with embeddings)
create table if not exists document_sections (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references documents(id) on delete cascade not null,
  content text not null,
  embedding vector(384),   -- Transformers.js embedding
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROOMS (Real-time Collaboration)
create table if not exists rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references profiles(id) on delete set null,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SKILLS (Gamification Tree)
create table if not exists skills (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  category text not null, -- 'frontend', 'backend', 'ai'
  parents uuid[] default '{}', -- Adjacency list for DAG
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_skills (
  user_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  status text check (status in ('locked', 'unlocked', 'mastered')),
  primary key (user_id, skill_id)
);

-- 5. CHAT MESSAGES
create table if not exists chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PILLAR 4: SECURITY Policies (RLS)
alter table profiles enable row level security;
alter table documents enable row level security;
alter table document_sections enable row level security;
alter table rooms enable row level security;
alter table skills enable row level security;
alter table user_skills enable row level security;
alter table chat_messages enable row level security;

-- Profiles
create policy "Public Read Profiles" on profiles for select using (true);
create policy "Self Update Profiles" on profiles for update using (auth.uid() = id);

-- Documents
create policy "Users can read own documents" on documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on documents for insert with check (auth.uid() = user_id);
create policy "Users can delete own documents" on documents for delete using (auth.uid() = user_id);

-- Document Sections
create policy "Users can read own document sections" on document_sections for select using (
  exists (select 1 from documents where id = document_sections.document_id and user_id = auth.uid())
);
create policy "Users can insert own document sections" on document_sections for insert with check (
  exists (select 1 from documents where id = document_sections.document_id and user_id = auth.uid())
);

-- Rooms
create policy "Public Join" on rooms for select using (true);

-- Skills
create policy "Public Read" on skills for select using (true);

-- STORAGE BUCKET
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Users can upload documents" on storage.objects
  for insert with check ( bucket_id = 'documents' and auth.uid() = owner );

create policy "Users can read own documents from storage" on storage.objects
  for select using ( bucket_id = 'documents' and auth.uid() = owner );

-- VECTOR SEARCH FUNCTION
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_user_id uuid default null
)
returns table (
  id uuid,
  content text,
  similarity float,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select
    document_sections.id,
    document_sections.content,
    1 - (document_sections.embedding <=> query_embedding) as similarity,
    document_sections.metadata
  from document_sections
  join documents on documents.id = document_sections.document_id
  where 1 - (document_sections.embedding <=> query_embedding) > match_threshold
  and (filter_user_id is null or documents.user_id = filter_user_id)
  order by document_sections.embedding <=> query_embedding
  limit match_count;
end;
$$;
