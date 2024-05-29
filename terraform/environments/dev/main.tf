module "ssm" {
  stage             = "dev"
  supabase_url      = var.supabase_url
  supabase_anon_key = var.supabase_anon_key
  supabase_service_role_key = var.supabase_service_role_key
  app_key           = var.app_key

  source = "../../modules/ssm"
}
