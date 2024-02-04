module "ssm" {
  stage            = "dev"
  supabase_url      = var.supabase_url
  supabase_anon_key = var.supabase_anon_key
  app_key           = var.app_key

  source = "../../modules/ssm"
}
