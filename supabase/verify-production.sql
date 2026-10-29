-- READ ONLY: inspect the real project; never resets learner data.
select tablename as tablo, rowsecurity as rls_acik,
 (select count(*) from pg_policies p where p.schemaname=t.schemaname and p.tablename=t.tablename) as politika_sayisi
from pg_tables t where schemaname='public' order by tablename;
select tablename, policyname, roles, cmd, qual, with_check from pg_policies where schemaname='public' order by tablename,policyname;
select routine_name, grantee, privilege_type from information_schema.routine_privileges
where routine_schema='public' and routine_name in ('save_learning_snapshot','delete_private_learning_data','gamification_rules_version') order by routine_name,grantee;
select to_regprocedure('public.gamification_rules_version()') is not null as adim_14_fonksiyonu_var;
