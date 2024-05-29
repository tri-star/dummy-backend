alter table "public"."admin_tokens" enable row level security;

alter table "public"."admin_users" enable row level security;

alter table "public"."companies" enable row level security;

alter table "public"."tasks" enable row level security;

alter table "public"."tokens" enable row level security;

alter table "public"."users" enable row level security;

create policy "deny anon access"
on "public"."admin_tokens"
as permissive
for all
to anon
using (false);


create policy "deny anon access"
on "public"."admin_users"
as permissive
for all
to anon
using (false);


create policy "deny anon access"
on "public"."companies"
as permissive
for all
to anon
using (false);


create policy "deny anon access"
on "public"."tasks"
as permissive
for all
to anon
using (false);


create policy "deny anon access"
on "public"."tokens"
as permissive
for all
to anon
using (false);


create policy "deny anon access"
on "public"."users"
as permissive
for all
to anon
using (false);
