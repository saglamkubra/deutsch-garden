-- Gamification validation runs inside the existing snapshot transaction.
begin;
alter table public.learning_reward_receipts drop constraint if exists learning_reward_receipts_kind_check;
alter table public.learning_reward_receipts add constraint learning_reward_receipts_kind_check check(kind in ('seed','coins','decoration'));
create function public.game_badge_eligible(p jsonb, badge text) returns boolean language plpgsql immutable set search_path='' as $$
declare m jsonb:=p->'modules'; count_sessions integer; words integer;
begin
 if badge='first-diary' then return false; end if;
 if badge='first-vocabulary' then return exists(select 1 from jsonb_each(coalesce(m#>'{mini-courses,progress}','{}')) a where a.value->'completedAt'<>'null') or exists(select 1 from jsonb_each(coalesce(m#>'{learning,assignments}','{}')) a where jsonb_array_length(a.value->'newIds')+jsonb_array_length(a.value->'reviewIds')>0 and (select count(*) from jsonb_object_keys(a.value->'answers'))=jsonb_array_length(a.value->'newIds')+jsonb_array_length(a.value->'reviewIds')); end if;
 if badge='first-perfect' then return exists(select 1 from jsonb_each(coalesce(m#>'{exercises,sessions}','{}')) a where a.value->'completedAt'<>'null' and jsonb_array_length(a.value->'questions')>=3 and (select count(*) from jsonb_object_keys(a.value->'answers'))=jsonb_array_length(a.value->'questions') and not exists(select 1 from jsonb_each(a.value->'answers') b where b.value->>'correct'<>'true' or b.value->>'skipped'='true') and not exists(select 1 from jsonb_array_elements(coalesce(a.value->'attempts','[]')) b where b.value->>'correct'='false')); end if;
 if badge='first-grammar' then return exists(select 1 from jsonb_each(coalesce(m#>'{grammar,progress}','{}')) a where a.value->'completedAt'<>'null'); end if;
 if badge='first-listening' then return exists(select 1 from jsonb_each(coalesce(m#>'{listening,progress}','{}')) a where a.value->'completedAt'<>'null'); end if;
 if badge='first-story' then return jsonb_array_length(coalesce(m#>'{stories,completed}','[]'))>0; end if;
 if badge='first-conversation' then return exists(select 1 from jsonb_array_elements(coalesce(m#>'{lumi,claims}','[]')) a where a.value->>'delivered'='true'); end if;
 if badge='first-bloom' then return exists(select 1 from jsonb_array_elements(coalesce(m#>'{garden,plots}','[]')) a where a.value#>'{plant,bloomedAt}'<>'null') or (select count(*) from jsonb_object_keys(coalesce(m#>'{garden,collection}','{}')))>0; end if;
 if badge='words-100' then
  select count(distinct id) into words from (
    select key as id from jsonb_each(coalesce(m#>'{learning,progress}','{}')) a where coalesce((a.value->>'responses')::integer,0)>0
    union all select w.value#>>'{}' from jsonb_each(coalesce(m#>'{exercises,sessions}','{}')) s cross join lateral jsonb_array_elements(s.value->'questions') q cross join lateral jsonb_array_elements(q.value->'wordIds') w where s.value->'answers' ? (q.value->>'id') and coalesce(s.value#>>array['answers',q.value->>'id','skipped'],'false')<>'true'
  ) evidence;
  return words>=100;
 end if;
 if badge='sessions-10' then
  select count(*) into count_sessions from (
   select a.key from jsonb_each(coalesce(m#>'{exercises,sessions}','{}')) a where a.value->'completedAt'<>'null' and exists(select 1 from jsonb_each(a.value->'answers') b where coalesce(b.value->>'skipped','false')<>'true')
   union all select a.key from jsonb_each(coalesce(m#>'{grammar,progress}','{}')) a where a.value->'completedAt'<>'null'
   union all select a.key from jsonb_each(coalesce(m#>'{listening,progress}','{}')) a where a.value->'completedAt'<>'null'
   union all select a.value#>>'{}' from jsonb_array_elements(coalesce(m#>'{stories,completed}','[]')) a
   union all select a.key from jsonb_each(coalesce(m#>'{mini-courses,progress}','{}')) a where a.value->'completedAt'<>'null'
   union all select a.value#>>'{receipt,id}' from jsonb_array_elements(coalesce(m#>'{lumi,claims}','[]')) a where a.value->>'delivered'='true'
   union all select a.key from jsonb_each(coalesce(m#>'{learning,assignments}','{}')) a where jsonb_array_length(a.value->'newIds')+jsonb_array_length(a.value->'reviewIds')>0 and (select count(*) from jsonb_object_keys(a.value->'answers'))=jsonb_array_length(a.value->'newIds')+jsonb_array_length(a.value->'reviewIds')
  ) sessions;
  return count_sessions>=10;
 end if;
 return false;
end $$;
revoke all on function public.game_badge_eligible(jsonb,text) from public,anon,authenticated;
create function public.validate_gamification_snapshot(u uuid,p jsonb,previous jsonb) returns void language plpgsql security definer set search_path='' as $$
declare m jsonb:=p->'modules'; badge text; entry record; day text; word text; receipt text; amount integer;
begin
 if auth.uid() is distinct from u then raise exception 'AUTH_REQUIRED'; end if;
 for entry in select * from jsonb_each(coalesce(m#>'{exercises,gamification,badges}','{}')) loop
  if not public.game_badge_eligible(p,entry.key) then raise exception 'INVALID_ACHIEVEMENT'; end if;
 end loop;
 for entry in select * from jsonb_each(coalesce(m#>'{exercises,xp}','{}')) where key like 'vocabulary:%' loop
  if entry.value<>'5'::jsonb or entry.key !~ '^vocabulary:[0-9]{4}-[0-9]{2}-[0-9]{2}:.+$' then raise exception 'INVALID_XP'; end if;
  day:=substring(entry.key from 12 for 10); word:=substring(entry.key from 23);
  if not coalesce(previous#>'{modules,exercises,xp}','{}') ? entry.key then
   if not exists(select 1 from jsonb_each(coalesce(m#>'{learning,assignments}','{}')) a where a.value->>'date'=day and a.value->'answers' ? word) and coalesce(m#>>array['learning','progress',word,'lastAnsweredOn'],'')<>day then raise exception 'INVALID_XP_EVIDENCE'; end if;
  end if;
 end loop;
 if exists(select 1 from jsonb_each(coalesce(m#>'{exercises,xp}','{}')) a where key like 'vocabulary:%' group by substring(key from 12 for 10) having count(*)>20) then raise exception 'DAILY_XP_LIMIT'; end if;
 for receipt in select value#>>'{}' from jsonb_array_elements(coalesce(m#>'{garden,appliedRewards}','[]')) where value#>>'{}' like 'achievement:%' loop
  if coalesce(previous#>'{modules,garden,appliedRewards}','[]') ? receipt then continue; end if;
  badge:=substring(receipt from 13);
  if not public.game_badge_eligible(p,badge) then raise exception 'INVALID_ACHIEVEMENT'; end if;
  if exists(select 1 from public.learning_reward_receipts where user_id=u and id=receipt) then raise exception 'ACHIEVEMENT_ALREADY_CLAIMED'; end if;
  amount:=case when badge='first-vocabulary' then 2 else 1 end;
  insert into public.learning_reward_receipts(user_id,id,kind,amount,delivered_at) values(u,receipt,case when badge in ('first-conversation','sessions-10') then 'decoration' else 'seed' end,amount,now());
 end loop;
end $$;
revoke all on function public.validate_gamification_snapshot(uuid,jsonb,jsonb) from public,anon,authenticated;
create or replace function public.save_learning_snapshot(p_expected bigint,p_operation uuid,p_payload jsonb,p_import_hash text default null,p_archive boolean default false,p_private_epoch bigint default 0)
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
 perform public.validate_gamification_snapshot(u,p_payload,current_row.payload);
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


create function public.gamification_rules_version() returns integer language sql immutable set search_path='' as $$ select 14 $$;
revoke all on function public.gamification_rules_version() from public,anon;
grant execute on function public.gamification_rules_version() to authenticated;
commit;
