begin;
create table public.push_subscriptions(user_id uuid not null references auth.users(id) on delete cascade,endpoint text primary key check(length(endpoint)<2048),p256dh text not null check(length(p256dh)<256),auth text not null check(length(auth)<128),last_day date,created_at timestamptz not null default now());
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from public,anon,authenticated;
grant select,delete on public.push_subscriptions to authenticated;
grant insert(user_id,endpoint,p256dh,auth),update(user_id,endpoint,p256dh,auth) on public.push_subscriptions to authenticated;
grant all on public.push_subscriptions to service_role;
create policy own_push_read on public.push_subscriptions for select to authenticated using(user_id=(select auth.uid()));
create policy own_push_delete on public.push_subscriptions for delete to authenticated using(user_id=(select auth.uid()));
create policy own_push_update on public.push_subscriptions for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy own_push_insert on public.push_subscriptions for insert to authenticated with check(user_id=(select auth.uid()));

create function public.guard_push_devices() returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform 1 from auth.users where id=new.user_id for update;
 if not exists(select 1 from public.push_subscriptions where endpoint=new.endpoint) and (select count(*) from public.push_subscriptions where user_id=new.user_id)>=5 then raise exception 'DEVICE_LIMIT'; end if;
 return new;
end $$;
revoke all on function public.guard_push_devices() from public,anon,authenticated;
create trigger push_device_limit before insert on public.push_subscriptions for each row execute function public.guard_push_devices();
create function public.claim_push_batch() returns setof public.push_subscriptions language sql security definer set search_path='' as $$
 update public.push_subscriptions set last_day=(now() at time zone 'Europe/Istanbul')::date where endpoint in(select endpoint from public.push_subscriptions where last_day is distinct from (now() at time zone 'Europe/Istanbul')::date order by created_at limit 50 for update skip locked) returning *;
$$;
revoke all on function public.claim_push_batch() from public,anon,authenticated;
grant execute on function public.claim_push_batch() to service_role;
commit;
