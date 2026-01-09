-- Enable Vector Extension
create extension if not exists vector;

-- Document Sections Table
create table if not exists document_sections (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references documents(id) on delete cascade not null,
  content text not null,
  embedding vector(384),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Document Sections
alter table document_sections enable row level security;

-- Policy: Users can only see sections of documents they own
create policy "Private Data Sections" on document_sections using (
  exists (
    select 1 from documents
    where documents.id = document_sections.document_id
    and documents.user_id = auth.uid()
  )
);

-- Match Documents Function (Cosine Similarity)
drop function if exists match_documents(vector, double precision, int, uuid);
drop function if exists match_documents(vector, float, int, uuid);

create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_user_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    ds.id,
    ds.document_id,
    ds.content,
    1 - (ds.embedding <=> query_embedding) as similarity
  from document_sections ds
  join documents d on d.id = ds.document_id
  where 1 - (ds.embedding <=> query_embedding) > match_threshold
  and (filter_user_id is null or d.user_id = filter_user_id)
  order by ds.embedding <=> query_embedding
  limit match_count;
end;
$$;
