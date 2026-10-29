-- Additive: apply manually after 009. Existing data is never reset.
begin;
create table public.diary_practice_claims (
 user_id uuid not null references auth.users(id) on delete cascade,
 day date not null,
 claimed_at timestamptz not null default now(),
 primary key(user_id,day)
);
alter table public.diary_practice_claims enable row level security;
revoke all on public.diary_practice_claims from public,anon,authenticated;
grant select on public.diary_practice_claims to authenticated;
create policy own_diary_practice on public.diary_practice_claims for select to authenticated using(user_id=(select auth.uid()));
create function public.claim_diary_practice(p_entry uuid) returns text language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); d date:=(now() at time zone 'Europe/Istanbul')::date; body text;
begin
 if u is null then raise exception 'AUTH_REQUIRED'; end if;
 select content into body from public.diary_entries where id=p_entry and user_id=u;
 if body is null then raise exception 'DIARY_NOT_FOUND'; end if;
 if length(trim(body))<80 or cardinality(regexp_split_to_array(trim(body),'\s+'))<20 then raise exception 'DIARY_TOO_SHORT'; end if;
 insert into public.diary_practice_claims(user_id,day) values(u,d) on conflict do nothing;
 return 'diary:day:'||d::text;
end $$;
revoke all on function public.claim_diary_practice(uuid) from public,anon;
grant execute on function public.claim_diary_practice(uuid) to authenticated;
alter function public.game_badge_eligible(jsonb,text) rename to game_badge_eligible_v14;
create function public.game_badge_eligible(p jsonb,badge text) returns boolean language plpgsql stable security definer set search_path='' as $$
begin
 if badge='first-diary' then return exists(select 1 from public.diary_practice_claims where user_id=auth.uid()) and exists(select 1 from jsonb_each(coalesce(p#>'{modules,exercises,xp}','{}')) e where e.key like 'diary:day:%' and e.value='15'::jsonb and exists(select 1 from public.diary_practice_claims c where c.user_id=auth.uid() and c.day::text=substring(e.key from 11))); end if;
 return public.game_badge_eligible_v14(p,badge);
end $$;
revoke all on function public.game_badge_eligible(jsonb,text) from public,anon,authenticated;
alter function public.validate_gamification_snapshot(uuid,jsonb,jsonb) rename to validate_gamification_snapshot_v14;
create function public.validate_gamification_snapshot(u uuid,p jsonb,previous jsonb) returns void language plpgsql security definer set search_path='' as $$
declare e record;
begin
 if auth.uid() is distinct from u then raise exception 'AUTH_REQUIRED'; end if;
 for e in select * from jsonb_each(coalesce(p#>'{modules,exercises,xp}','{}')) where key like 'diary:%' loop
  if e.key !~ '^diary:day:[0-9]{4}-[0-9]{2}-[0-9]{2}$' or e.value<>'15'::jsonb or not exists(select 1 from public.diary_practice_claims c where c.user_id=u and c.day::text=substring(e.key from 11)) then raise exception 'INVALID_XP_EVIDENCE'; end if;
 end loop;
 perform public.validate_gamification_snapshot_v14(u,p,previous);
end $$;
revoke all on function public.validate_gamification_snapshot(uuid,jsonb,jsonb) from public,anon,authenticated;
-- Private content deletion keeps earned receipts; account deletion cascades.
commit;
