-- Buildex assistant knowledge base: run once in Supabase SQL Editor.
create extension if not exists vector with schema extensions;

create table if not exists public.buildex_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  category text not null,
  mime_type text not null,
  file_size bigint not null default 0,
  storage_path text unique,
  content_text text,
  status text not null default 'uploading'
    check (status in ('uploading','processing','ready','error','deleted','superseded')),
  is_active boolean not null default false,
  processing_error text,
  replaces_document_id uuid references public.knowledge_documents(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.knowledge_chunks (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding extensions.vector(1536) not null,
  created_at timestamptz not null default now(),
  unique(document_id, chunk_index)
);

create index if not exists knowledge_chunks_embedding_hnsw
  on public.knowledge_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists knowledge_documents_active_status
  on public.knowledge_documents (is_active, status);

alter table public.buildex_admins enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;
-- No client policies: browser clients cannot read or mutate knowledge directly.
-- The server verifies Auth and buildex_admins, then uses the service role.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'buildex-knowledge',
  'buildex-knowledge',
  false,
  15728640,
  array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.match_buildex_knowledge(
  query_embedding extensions.vector(1536),
  match_count integer default 8
)
returns table (
  document_id uuid,
  file_name text,
  category text,
  content text,
  similarity double precision
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select d.id, d.file_name, d.category, c.content,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where d.status = 'ready' and d.is_active = true
    and 1 - (c.embedding <=> query_embedding) >= 0.30
  order by c.embedding <=> query_embedding
  limit least(greatest(coalesce(match_count, 8), 1), 12);
$$;

revoke all on function public.match_buildex_knowledge(extensions.vector, integer) from public, anon, authenticated;
grant execute on function public.match_buildex_knowledge(extensions.vector, integer) to service_role;

-- Atomically publish only fully embedded documents and retire replaced sources.
create or replace function public.activate_buildex_document(
  target_id uuid,
  prior_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if prior_id is not null then
    update public.knowledge_documents
       set is_active = false, status = 'superseded', updated_at = now()
     where id = prior_id;
    delete from public.knowledge_chunks where document_id = prior_id;
  end if;

  update public.knowledge_documents
     set is_active = true, status = 'ready', processing_error = null,
         processed_at = now(), updated_at = now(), replaces_document_id = null
   where id = target_id and status = 'processing';

  if not found then
    raise exception 'Document is not processing';
  end if;
end;
$$;

revoke all on function public.activate_buildex_document(uuid, uuid) from public, anon, authenticated;
grant execute on function public.activate_buildex_document(uuid, uuid) to service_role;
