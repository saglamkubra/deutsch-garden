-- Additive only. Apply manually after 001--007. No private letters are imported here.
begin;
create table public.dg_server_state (
 key text primary key check(key in ('lumi-ledger-v1','birthday-config-v1','birthday-access-v1')),
 revision bigint not null default 1 check(revision>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=2000000),
 last_operation uuid not null,
 updated_at timestamptz not null default now()
);
alter table public.dg_server_state enable row level security;
revoke all on public.dg_server_state from public,anon,authenticated;
grant select,insert,update on public.dg_server_state to service_role;
-- Server bookkeeping, not learner-accessible data: no client RLS policy is intentional.
create function public.dg_server_state_read(p_key text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.dg_server_state;
begin
 if p_key not in ('lumi-ledger-v1','birthday-config-v1','birthday-access-v1') then raise exception 'INVALID_KEY'; end if;
 select * into r from public.dg_server_state where key=p_key;
 if not found then return jsonb_build_object('revision',0,'payload',null); end if;
 return jsonb_build_object('revision',r.revision,'payload',r.payload);
end $$;
create function public.dg_server_state_cas(p_key text,p_expected bigint,p_payload jsonb,p_operation uuid) returns boolean language plpgsql security invoker set search_path='' as $$
declare r public.dg_server_state;
begin
 if p_key not in ('lumi-ledger-v1','birthday-config-v1','birthday-access-v1') or p_expected<0 or p_operation is null or p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>2000000 then raise exception 'INVALID_STATE'; end if;
 -- Different absent-row inserts and all writers serialize across processes and restarts.
 perform pg_catalog.pg_advisory_xact_lock(73160,case p_key when 'lumi-ledger-v1' then 1 when 'birthday-config-v1' then 2 else 3 end);
 select * into r from public.dg_server_state where key=p_key for update;
 if found and r.last_operation=p_operation then
  if r.payload<>p_payload then raise exception 'OPERATION_MISMATCH'; end if;
  return true;
 end if;
 if coalesce(r.revision,0)<>p_expected then return false; end if;
 insert into public.dg_server_state(key,revision,payload,last_operation) values(p_key,p_expected+1,p_payload,p_operation)
 on conflict(key) do update set revision=excluded.revision,payload=excluded.payload,last_operation=excluded.last_operation,updated_at=now();
 return true;
end $$;
revoke all on function public.dg_server_state_read(text),public.dg_server_state_cas(text,bigint,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.dg_server_state_read(text),public.dg_server_state_cas(text,bigint,jsonb,uuid) to service_role;
commit;
