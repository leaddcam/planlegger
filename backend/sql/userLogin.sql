-- extensions
create extension if not exists "uuid-ossp";

-- users
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  display_name text,
  email_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on users (email);

-- email verification tokens
create table if not exists email_verifications (
  user_id uuid not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists email_verifications_user_idx on email_verifications (user_id);
create index if not exists email_verifications_expires_idx on email_verifications (expires_at);

-- your existing domain tables might already exist.
-- ensure they have a user_id column and helpful indexes.

alter table if exists notatblokker
  add column if not exists user_id uuid references users(id) on delete cascade;

alter table if exists notater
  add column if not exists user_id uuid references users(id) on delete cascade;

-- helpful indexes for scoping/queries
create index if not exists notatblokker_user_idx on notatblokker (user_id);
create index if not exists notater_user_idx on notater (user_id);
create index if not exists notater_interesse_idx on notater (interesse) where interesse is not null;
create index if not exists notater_emne_idx on notater (emne) where emne is not null;
