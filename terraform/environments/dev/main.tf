module "ssm" {
  supabase_url      = var.supabase_url
  supabase_anon_key = var.supabase_anon_key

  source = "../../modules/ssm"
}
