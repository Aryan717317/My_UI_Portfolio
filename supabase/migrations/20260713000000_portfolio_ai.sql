-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create the table for portfolio knowledge documents
create table if not exists portfolio_knowledge (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  embedding vector(384), -- optimized for 384-dimension embeddings (e.g. all-MiniLM-L6-v2)
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an HNSW index for high-performance cosine similarity searches
create index if not exists portfolio_knowledge_hnsw_idx 
on portfolio_knowledge using hnsw (embedding vector_cosine_ops);

-- Create the database RPC function to match documents using cosine distance (<=>)
create or replace function match_portfolio_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    portfolio_knowledge.id,
    portfolio_knowledge.content,
    portfolio_knowledge.metadata,
    1 - (portfolio_knowledge.embedding <=> query_embedding) as similarity
  from portfolio_knowledge
  where 1 - (portfolio_knowledge.embedding <=> query_embedding) > match_threshold
  order by portfolio_knowledge.embedding <=> query_embedding asc
  limit match_count;
end;
$$;
