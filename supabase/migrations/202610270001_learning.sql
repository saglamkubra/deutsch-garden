-- Step 4; apply only to a configured Supabase PostgreSQL project.
-- No service key belongs in the browser. Local adapters do not execute this file.
begin;
create table public.learning_levels (
 code text primary key check (code in ('A1','A2','B1','B2','C1','C2')),
 world_name text not null, description text not null, position smallint not null unique
);
create table public.learning_units (
 id text primary key, level_code text not null references public.learning_levels(code),
 position smallint not null, title text not null, goal text not null,
 unique(level_code,position)
);
create table public.learning_lessons (
 id text primary key, unit_id text not null references public.learning_units(id),
 title text not null, kind text not null check(kind in ('vocabulary','planned')),
 description text not null, content_status text not null check(content_status in ('ready','planned'))
);
create table public.vocabulary (
 id text primary key, german_word text not null, turkish_meaning text not null,
 article text check(article in ('der','die','das')), plural_form text, plural_note text,
 word_type text not null check(word_type in ('noun','verb','adjective','expression','adverb','number')),
 cefr_level text not null references public.learning_levels(code),
 category text not null, sense_key text not null, normalized_key text not null unique,
 example_sentence_de text not null, example_sentence_tr text not null,
 pronunciation_hint text, audio_url text check(audio_url is null or audio_url like 'https://%'),
 difficulty smallint not null check(difficulty between 1 and 5),
 source_name text not null, source_url text, license text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(length(trim(german_word))>0 and length(trim(turkish_meaning))>0),
 check((word_type='noun' and article is not null and (plural_form is not null or plural_note is not null))
       or (word_type<>'noun' and article is null and plural_form is null))
);
create index vocabulary_level_idx on public.vocabulary(cefr_level);
create index vocabulary_category_idx on public.vocabulary(category);
create index vocabulary_german_idx on public.vocabulary(german_word);
create index vocabulary_search_idx on public.vocabulary using gin(to_tsvector('simple',german_word||' '||turkish_meaning));
create table public.vocabulary_levels (
 vocabulary_id text references public.vocabulary(id) on delete cascade,
 level_code text references public.learning_levels(code), primary key(vocabulary_id,level_code)
);
create index vocabulary_levels_level_idx on public.vocabulary_levels(level_code,vocabulary_id);
create table public.vocabulary_topics (
 vocabulary_id text references public.vocabulary(id) on delete cascade,
 topic text not null, primary key(vocabulary_id,topic)
);
create index vocabulary_topics_topic_idx on public.vocabulary_topics(topic,vocabulary_id);
create table public.vocabulary_units (
 vocabulary_id text references public.vocabulary(id) on delete cascade,
 unit_id text references public.learning_units(id) on delete cascade, primary key(vocabulary_id,unit_id)
);
create index vocabulary_units_unit_idx on public.vocabulary_units(unit_id,vocabulary_id);
create table public.learning_user_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 selected_level text not null references public.learning_levels(code) default 'A1',
 daily_goal smallint not null default 10 check(daily_goal in (5,10,15,20))
);
create table public.daily_vocabulary_assignments (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 local_date date not null, level_code text not null references public.learning_levels(code),
 goal smallint not null check(goal in (5,10,15,20)), created_at timestamptz not null default now(),
 unique(user_id,local_date,level_code),unique(id,user_id)
);
create table public.daily_vocabulary_items (
 assignment_id uuid not null, user_id uuid not null references auth.users(id) on delete cascade,
 vocabulary_id text not null references public.vocabulary(id),
 item_kind text not null check(item_kind in ('new','review')), position smallint not null,
 answer text check(answer in ('known','again')), answered_at timestamptz,
 primary key(assignment_id,vocabulary_id),
 foreign key(assignment_id,user_id) references public.daily_vocabulary_assignments(id,user_id) on delete cascade,
 unique(assignment_id,item_kind,position)
);
create index daily_items_owner_idx on public.daily_vocabulary_items(user_id);
create table public.vocabulary_learning_progress (
 user_id uuid references auth.users(id) on delete cascade,
 vocabulary_id text references public.vocabulary(id), introduced_on date not null,
 due_on date not null, known boolean not null default false, streak integer not null default 0 check(streak>=0),
 responses integer not null default 0 check(responses>=0), last_answered_on date,
 primary key(user_id,vocabulary_id)
);
create index vocabulary_due_idx on public.vocabulary_learning_progress(user_id,due_on);
create table public.unit_vocabulary_responses (
 user_id uuid references auth.users(id) on delete cascade, unit_id text references public.learning_units(id),
 vocabulary_id text references public.vocabulary(id), local_date date not null,
 answer text not null check(answer in ('known','again')), primary key(user_id,unit_id,vocabulary_id,local_date)
);
create table public.learning_milestones (
 user_id uuid references auth.users(id) on delete cascade, lesson_id text references public.learning_lessons(id),
 earned_at timestamptz not null default now(), primary key(user_id,lesson_id)
);
create table public.learning_reward_receipts (
 user_id uuid references auth.users(id) on delete cascade, id text not null,
 kind text not null check(kind in ('seed','coins')), amount integer not null check(amount>0),
 delivered_at timestamptz, primary key(user_id,id)
);
-- Explicit least-privilege grants; user-owned data never has an anonymous policy.
do $$
declare t text;
begin
 foreach t in array array['learning_levels','learning_units','learning_lessons','vocabulary','vocabulary_levels','vocabulary_topics','vocabulary_units']
 loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon, authenticated',t);
  execute format('grant select on public.%I to anon, authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy catalog_read on public.%I for select to anon, authenticated using (true)',t);
 end loop;
 foreach t in array array['learning_user_settings','daily_vocabulary_assignments','daily_vocabulary_items','vocabulary_learning_progress','unit_vocabulary_responses','learning_milestones']
 loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon, authenticated',t);
  execute format('grant select, insert, update, delete on public.%I to authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy own_select on public.%I for select to authenticated using ((select auth.uid()) = user_id)',t);
  execute format('create policy own_insert on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',t);
  execute format('create policy own_update on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',t);
  execute format('create policy own_delete on public.%I for delete to authenticated using ((select auth.uid()) = user_id)',t);
 end loop;
end $$;
alter table public.learning_reward_receipts enable row level security;
revoke all on public.learning_reward_receipts from anon, authenticated;
grant select on public.learning_reward_receipts to authenticated;
grant all on public.learning_reward_receipts to service_role;
create policy own_reward_read on public.learning_reward_receipts for select to authenticated using ((select auth.uid())=user_id);
-- Production awarding must be a server-side transaction/RPC deriving rewards from verified progress.
-- Neither this migration nor user-written milestones grant remote garden inventory.
commit;
