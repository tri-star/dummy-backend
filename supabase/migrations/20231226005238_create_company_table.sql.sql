CREATE TABLE company (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  postalCode INTEGER NOT NULL,
  prefecture TEXT NOT NULL,
  address1 TEXT NOT NULL, -- 市区町村
  address2 TEXT NOT NULL, -- 番地
  address3 TEXT, -- アパート (オプショナル)
  phone TEXT NOT NULL,
  canUseFeatureA BOOLEAN NOT NULL DEFAULT false,
  canUseFeatureB BOOLEAN NOT NULL DEFAULT false,
  canUseFeatureC BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_company_name ON company (name);
