resource "aws_secretsmanager_secret" "supabase_url" {
  name        = "/supabase/url"
  description = "Supabase URL"
}

resource "aws_secretsmanager_secret_version" "supabase_url_version" {
  secret_id     = aws_secretsmanager_secret.supabase_url.id
  secret_string = var.supabase_url
}

resource "aws_secretsmanager_secret" "supabase_anon_key" {
  name        = "/supabase/anon_key"
  description = "Supabase Anon Key"
}

resource "aws_secretsmanager_secret_version" "supabase_anon_key_version" {
  secret_id     = aws_secretsmanager_secret.supabase_anon_key.id
  secret_string = var.supabase_anon_key
}

