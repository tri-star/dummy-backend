create table admin_tokens (
  id varchar(26) primary key not null,
  admin_user_id varchar(26) not null,
  token text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

CREATE INDEX idx_admin_tokens_admin_user_id ON admin_tokens (admin_user_id);
CREATE INDEX idx_admin_tokens_token ON admin_tokens (token);
CREATE INDEX idx_admin_tokens_updated_at ON admin_tokens (updated_at);

create table admin_users (
  id varchar(26) primary key not null,
  name text not null,
  login_id text not null,
  password text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE admin_tokens ADD CONSTRAINT fk_admin_tokens_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES admin_users (id);
CREATE INDEX idx_admin_users_login_id ON admin_users (login_id);
CREATE INDEX idx_admin_users_name ON admin_users (name);
CREATE INDEX idx_admin_users_updated_at ON admin_users (updated_at);

CREATE TABLE companies (
  id varchar(26) PRIMARY KEY,
  name TEXT NOT NULL,
  postal_code varchar(8) NOT NULL,
  prefecture TEXT NOT NULL,
  address1 TEXT NOT NULL, -- 市区町村
  address2 TEXT NOT NULL, -- 番地
  address3 TEXT, -- アパート (オプショナル)
  phone TEXT NOT NULL,
  canUseFeature_a BOOLEAN NOT NULL DEFAULT false,
  canUseFeature_b BOOLEAN NOT NULL DEFAULT false,
  canUseFeature_c BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_companies_company_name ON companies (name);
CREATE INDEX idx_companies_updated_at ON companies (updated_at);

CREATE TABLE tasks (
    id VARCHAR(26) PRIMARY KEY,
    company_id VARCHAR(26) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    reason_code VARCHAR(255),
    created_user VARCHAR(26) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_tasks_company_id ON tasks (company_id);
CREATE INDEX idx_tasks_title ON tasks (title);
CREATE INDEX idx_tasks_updated_at ON tasks (updated_at);


create table tokens (
  id varchar(26) primary key not null,
  user_id varchar(26) not null,
  token text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

CREATE INDEX idx_tokens_user_id ON tokens (user_id);
CREATE INDEX idx_tokens_token ON tokens (token);
CREATE INDEX idx_tokens_updated_at ON tokens (updated_at);

create table users (
  id varchar(26) primary key not null,
  name text not null,
  email text not null,
  login_id text not null,
  password text not null,
  -- company_id varchar(26) not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE tokens ADD CONSTRAINT fk_tokens_user_id FOREIGN KEY (user_id) REFERENCES users (id);
-- ALTER TABLE users ADD CONSTRAINT fk_users_company_id FOREIGN KEY (company_id) REFERENCES companies (id);
CREATE INDEX idx_users_login_id ON users (login_id);
CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);
CREATE INDEX idx_users_updated_at ON users (updated_at);
