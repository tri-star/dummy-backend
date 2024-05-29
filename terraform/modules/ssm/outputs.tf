output "supabase_url_arn" {
  value       = aws_secretsmanager_secret.supabase_url.arn
  description = "The ARN of the Supabase URL secret"
}

output "supabase_anon_key_arn" {
  value       = aws_secretsmanager_secret.supabase_anon_key.arn
  description = "The ARN of the Supabase Anon Key secret"
}

output "supabase_service_role_key_arn" {
  value       = aws_secretsmanager_secret.supabase_service_role_key.arn
  description = "The ARN of the Supabase Anon Key secret"
}
