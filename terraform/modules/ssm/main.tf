resource "aws_secretsmanager_secret" "supabase_url" {
  name        = "${var.stage}/supabase/url"
  description = "Supabase URL"
}

resource "aws_secretsmanager_secret_version" "supabase_url_version" {
  secret_id     = aws_secretsmanager_secret.supabase_url.id
  secret_string = var.supabase_url
}

resource "aws_secretsmanager_secret" "supabase_anon_key" {
  name        = "${var.stage}/supabase/anon_key"
  description = "Supabase Anon Key"
}

resource "aws_secretsmanager_secret_version" "supabase_anon_key_version" {
  secret_id     = aws_secretsmanager_secret.supabase_anon_key.id
  secret_string = var.supabase_anon_key
}

resource "aws_secretsmanager_secret" "supabase_service_role_key" {
  name        = "${var.stage}/supabase/service_role_key"
  description = "Supabase Service Role Key"
}

resource "aws_secretsmanager_secret_version" "supabase_service_role_key_version" {
  secret_id     = aws_secretsmanager_secret.supabase_service_role_key.id
  secret_string = var.supabase_service_role_key
}


resource "aws_secretsmanager_secret" "app_key" {
  name        = "${var.stage}/app/key"
  description = "Application Key"
}

resource "aws_secretsmanager_secret_version" "app_key_version" {
  secret_id     = aws_secretsmanager_secret.app_key.id
  secret_string = var.app_key
}
