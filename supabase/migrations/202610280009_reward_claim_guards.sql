-- Additive permanent receipts; existing inventory/progress is neither reset nor rewritten.
begin;
create table public.dg_permanent_claims (
 user_id uuid not null references auth.users(id) on delete cascade,
 receipt text not null check(length(receipt)<=200),
 recorded_at timestamptz not null default now(),
 primary key(user_id,receipt)
);
alter table public.dg_permanent_claims enable row level security;
revoke all on public.dg_permanent_claims from public,anon,authenticated;
grant select on public.dg_permanent_claims to authenticated;
grant all on public.dg_permanent_claims to service_role;
create policy own_claim_read on public.dg_permanent_claims for select to authenticated using(user_id=(select auth.uid()));
-- Seed only the new receipt table from existing cloud documents, never alter user_progress.
insert into public.dg_permanent_claims(user_id,receipt)
select u.user_id,r.value from public.user_progress u cross join lateral jsonb_array_elements_text(coalesce(u.payload#>'{modules,garden,appliedRewards}','[]')) r
where r.value like 'gift:daily:%' or r.value like 'birthday:%' or r.value like 'lumi:daily:%'
on conflict do nothing;
create function public.dg_guard_permanent_claims() returns trigger language plpgsql security definer set search_path='' as $$
declare claim_id text; previous jsonb:='[]';
begin
 if TG_OP='UPDATE' then previous:=coalesce(OLD.payload#>'{modules,garden,appliedRewards}','[]'); end if;
 for claim_id in select value from jsonb_array_elements_text(coalesce(NEW.payload#>'{modules,garden,appliedRewards}','[]')) loop
  if claim_id not like 'gift:daily:%' and claim_id not like 'birthday:%' and claim_id not like 'lumi:daily:%' then continue; end if;
  if previous ? claim_id then continue; end if;
  if exists(select 1 from public.dg_permanent_claims c where c.user_id=NEW.user_id and c.receipt=claim_id) then raise exception 'REWARD_ALREADY_CLAIMED'; end if;
  insert into public.dg_permanent_claims(user_id,receipt) values(NEW.user_id,claim_id);
 end loop;
 return NEW;
end $$;
revoke all on function public.dg_guard_permanent_claims() from public,anon,authenticated;
create trigger dg_preserve_reward_claims before insert or update of payload on public.user_progress for each row execute function public.dg_guard_permanent_claims();
commit;
