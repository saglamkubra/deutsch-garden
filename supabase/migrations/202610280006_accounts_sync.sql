-- Accounts/cloud step 13. Existing normalized lesson/catalog tables are preserved.
-- A coherent versioned document is authoritative for the current local-first app.
begin;
alter table public.learning_user_settings
 add column display_name text not null default '' check(length(display_name)<=80),
 add column learning_goal text not null default '' check(length(learning_goal)<=300),
 add column notifications boolean not null default false,
 add column sound boolean not null default false;
create table public.user_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 0 check(revision>=0),
 private_epoch bigint not null default 0 check(private_epoch>=0),
 payload jsonb not null default '{"version":1,"modules":{}}',
 updated_at timestamptz not null default now(),
 check(jsonb_typeof(payload)='object' and payload->>'version'='1' and jsonb_typeof(payload->'modules')='object'),
 check(octet_length(payload::text)<=4000000)
);
create table public.progress_sync_receipts (
 user_id uuid references auth.users(id) on delete cascade,
 operation_id uuid not null, payload_hash text not null, revision bigint not null,
 import_hash text, created_at timestamptz not null default now(),
 primary key(user_id,operation_id), unique(user_id,import_hash)
);
create table public.progress_archives (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 revision bigint not null, payload jsonb not null, created_at timestamptz not null default now()
);
create index progress_archives_owner on public.progress_archives(user_id,created_at desc);
create table public.diary_entries (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null default '' check(length(title)<=200), content text not null check(length(content)<=20000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index diary_entries_owner on public.diary_entries(user_id,created_at desc);
alter table public.user_progress enable row level security;
alter table public.progress_sync_receipts enable row level security;
alter table public.progress_archives enable row level security;
alter table public.diary_entries enable row level security;
create policy own_progress on public.user_progress for select to authenticated using(user_id=(select auth.uid()));
create policy own_sync_receipts on public.progress_sync_receipts for select to authenticated using(user_id=(select auth.uid()));
create policy own_archives on public.progress_archives for select to authenticated using(user_id=(select auth.uid()));
create policy own_diary on public.diary_entries for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
revoke all on public.user_progress,public.progress_sync_receipts,public.progress_archives,public.diary_entries from anon,authenticated;
grant select on public.user_progress,public.progress_sync_receipts,public.progress_archives to authenticated;
grant select,insert,update,delete on public.diary_entries to authenticated;
grant all on public.user_progress,public.progress_sync_receipts,public.progress_archives,public.diary_entries to service_role;

create function public.save_learning_snapshot(p_expected bigint,p_operation uuid,p_payload jsonb,p_import_hash text default null,p_archive boolean default false,p_private_epoch bigint default 0)
returns public.user_progress language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); current_row public.user_progress; receipt public.progress_sync_receipts; h text; k text;
begin
 if u is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_payload is null or p_payload->>'version' is distinct from '1' or jsonb_typeof(p_payload->'modules') is distinct from 'object' or octet_length(p_payload::text)>4000000 then raise exception 'INVALID_PAYLOAD'; end if;
 for k in select jsonb_object_keys(p_payload->'modules') loop
   if k not in ('garden','learning','exercises','grammar','listening','stories','mini-courses','lumi','vocabulary','preferences') then raise exception 'INVALID_MODULE'; end if;
 end loop;
 if p_payload#>'{modules,garden}' is not null and
   (jsonb_typeof(p_payload#>'{modules,garden,coins}') is distinct from 'number' or (p_payload#>>'{modules,garden,coins}')::numeric not between 0 and 999999) then raise exception 'INVALID_BALANCE'; end if;
 if p_import_hash is not null and p_import_hash !~ '^[a-f0-9]{64}$' then raise exception 'INVALID_IMPORT'; end if;
 insert into public.user_progress(user_id) values(u) on conflict do nothing;
 select * into current_row from public.user_progress where user_id=u for update;
 h:=md5(p_payload::text);
 select * into receipt from public.progress_sync_receipts where user_id=u and operation_id=p_operation;
 if found then
   if receipt.payload_hash<>h or receipt.import_hash is distinct from p_import_hash then raise exception 'OPERATION_MISMATCH'; end if;
   -- Returning the latest revision is safe: the client verifies its exact payload.
   return current_row;
 end if;
 if p_import_hash is not null and exists(select 1 from public.progress_sync_receipts where user_id=u and import_hash=p_import_hash) then raise exception 'ALREADY_IMPORTED'; end if;
 if current_row.revision<>p_expected then raise exception 'SYNC_CONFLICT'; end if;
 if current_row.private_epoch<>p_private_epoch then raise exception 'PRIVACY_CONFLICT'; end if;
 if p_archive and current_row.revision>0 then
   insert into public.progress_archives(user_id,revision,payload) values(u,current_row.revision,current_row.payload);
 end if;
 update public.user_progress set payload=p_payload, revision=revision+1,updated_at=now() where user_id=u returning * into current_row;
 insert into public.progress_sync_receipts(user_id,operation_id,payload_hash,revision,import_hash) values(u,p_operation,h,current_row.revision,p_import_hash);
 -- Reuse the existing profile/settings table rather than create a competing profile.
 if exists(select 1 from public.learning_levels where code=coalesce(p_payload#>>'{modules,learning,level}','A1')) then
  insert into public.learning_user_settings(user_id,selected_level,daily_goal,display_name,learning_goal,notifications,sound)
  values(u,coalesce(p_payload#>>'{modules,learning,level}','A1'),coalesce((p_payload#>>'{modules,learning,goal}')::smallint,10),
   coalesce(p_payload#>>'{modules,preferences,displayName}',''),coalesce(p_payload#>>'{modules,preferences,learningGoal}',''),
   coalesce((p_payload#>>'{modules,preferences,notifications}')::boolean,false),coalesce((p_payload#>>'{modules,preferences,sound}')::boolean,false))
  on conflict(user_id) do update set selected_level=excluded.selected_level,daily_goal=excluded.daily_goal,display_name=excluded.display_name,learning_goal=excluded.learning_goal,notifications=excluded.notifications,sound=excluded.sound;
 end if;
 return current_row;
end $$;
revoke all on function public.save_learning_snapshot(bigint,uuid,jsonb,text,boolean,bigint) from public,anon;
grant execute on function public.save_learning_snapshot(bigint,uuid,jsonb,text,boolean,bigint) to authenticated;

-- Privacy deletion redacts archived copies too; increasing the revision blocks stale devices.
create function public.delete_private_learning_data(p_kind text)
returns public.user_progress language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); r public.user_progress;
begin
 if u is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_kind='diary' then delete from public.diary_entries where user_id=u;
 elsif p_kind='conversations' then
  insert into public.user_progress(user_id) values(u) on conflict do nothing;
  update public.progress_archives set payload=jsonb_set(jsonb_set(payload,'{modules,lumi,conversations}','[]',false),'{modules,lumi,active}','null',false) where user_id=u;
  update public.user_progress set payload=jsonb_set(jsonb_set(payload,'{modules,lumi,conversations}','[]',false),'{modules,lumi,active}','null',false),private_epoch=private_epoch+1,revision=revision+1,updated_at=now() where user_id=u;
 else raise exception 'INVALID_KIND'; end if;
 select * into r from public.user_progress where user_id=u;
 return r;
end $$;
revoke all on function public.delete_private_learning_data(text) from public,anon;
grant execute on function public.delete_private_learning_data(text) to authenticated;

-- Read-only security-invoker projections, not duplicate coin/inventory ledgers.
create view public.cloud_learning_modules with(security_invoker=true) as
 select p.user_id,p.revision,m.key as module,m.value as data from public.user_progress p cross join lateral jsonb_each(p.payload->'modules') m;
create view public.garden_accounts with(security_invoker=true) as
 select user_id,revision,payload#>'{modules,garden}' as garden,
 payload#>'{modules,garden,coins}' as coins,payload#>'{modules,garden,seeds}' as seeds,
 payload#>'{modules,garden,plots}' as plots,payload#>'{modules,garden,decorations}' as decorations,
 payload#>'{modules,garden,purchases}' as purchases,payload#>'{modules,garden,dailyGifts}' as daily_gifts,
 payload#>'{modules,garden,appliedRewards}' as reward_receipts from public.user_progress;
create view public.ai_conversation_history with(security_invoker=true) as
 select p.user_id,c.value->>'id' as id,c.value as conversation from public.user_progress p cross join lateral jsonb_array_elements(coalesce(p.payload#>'{modules,lumi,conversations}','[]')) c;
revoke all on public.cloud_learning_modules,public.garden_accounts,public.ai_conversation_history from anon;
grant select on public.cloud_learning_modules,public.garden_accounts,public.ai_conversation_history to authenticated;
commit;
