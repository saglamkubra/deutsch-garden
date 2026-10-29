-- READ ONLY. Run manually AFTER 008 and 009. Does not print letters, tokens or usage bodies.
select tablename,rowsecurity as rls_enabled from pg_tables where schemaname='public' and tablename in ('dg_server_state','dg_permanent_claims','user_progress');
select r as rol,
 has_table_privilege(r,'public.dg_server_state','SELECT') as server_read,
 has_table_privilege(r,'public.dg_server_state','UPDATE') as server_update,
 has_function_privilege(r,'public.dg_server_state_cas(text,bigint,jsonb,uuid)','EXECUTE') as server_cas,
 has_table_privilege(r,'public.dg_permanent_claims','INSERT') as direct_reward_insert
from unnest(array['anon','authenticated','service_role']) r;
select policyname,roles,cmd,qual,with_check from pg_policies where schemaname='public' and tablename in ('dg_server_state','dg_permanent_claims');
select tgname,tgenabled from pg_trigger where tgrelid='public.user_progress'::regclass and tgname='dg_preserve_reward_claims';
-- Before explicit import there should be zero server rows. Afterwards three rows, revision>=1.
select key,revision,updated_at,pg_column_size(payload) as stored_bytes from public.dg_server_state order by key;
select public.gamification_rules_version() as existing_game_rules_version;
