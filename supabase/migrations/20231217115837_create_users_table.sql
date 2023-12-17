create table users (
  id uuid primary key not null,
  name text not null,
  email text not null unique,
  password text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
