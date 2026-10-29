-- Step 7 preparation only; the local app does not execute this migration.
begin;
create table public.listening_categories (
 id text primary key, title_tr text not null, position integer not null
);
create table public.listening_episodes (
 id text primary key, level text not null references public.learning_levels(code),
 category_id text not null references public.listening_categories(id),
 title_tr text not null, title_de text not null, summary_tr text not null, icon text not null,
 content_status text not null check(content_status in ('ready','planned')),
 audio_kind text not null check(audio_kind in ('generated','browser','none')),
 lemmas jsonb not null default '[]', source_name text not null
);
create table public.listening_audio_assets (
 id text primary key, episode_id text references public.listening_episodes(id),
 vocabulary_id text references public.vocabulary(id), url text not null,
 duration double precision not null check(duration>0), sample_rate integer not null check(sample_rate>0),
 sha256 text not null, voice_name text not null, engine text not null, source_url text not null,
 license text not null, check((episode_id is null) <> (vocabulary_id is null))
);
create table public.listening_transcripts (
 id text primary key, episode_id text not null references public.listening_episodes(id),
 position integer not null, sentence_de text not null, translation_tr text not null,
 speaker text, word_links jsonb not null, audio_start double precision, audio_end double precision,
 unique(episode_id,position), check(audio_start is null or (audio_start>=0 and audio_end>audio_start))
);
create table public.listening_questions (
 id text primary key, episode_id text not null references public.listening_episodes(id),
 type_id text not null references public.exercise_question_types(id),
 position integer not null, prompt text not null, public_payload jsonb not null
);
create table public.listening_question_answers (
 question_id text primary key references public.listening_questions(id) on delete cascade,
 accepted jsonb not null, explanation_tr text not null
);
create table public.listening_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 episode_id text not null references public.listening_episodes(id), started_at timestamptz not null,
 last_at timestamptz not null, position double precision not null default 0 check(position>=0),
 heard_bins integer[] not null default '{}', completed_at timestamptz,
 primary key(user_id,episode_id)
);
create table public.listening_quiz_attempts (
 id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 episode_id text not null references public.listening_episodes(id), questions_snapshot jsonb not null,
 answers jsonb not null default '{}', position integer not null check(position between 0 and 4),
 started_at timestamptz not null default now(), completed_at timestamptz,
 accuracy integer check(accuracy between 0 and 100), unique(user_id,id)
);
create table public.listening_favorites (
 user_id uuid not null references auth.users(id) on delete cascade,
 episode_id text not null references public.listening_episodes(id),
 created_at timestamptz not null default now(), primary key(user_id,episode_id)
);
create table public.listening_daily_assignments (
 user_id uuid not null references auth.users(id) on delete cascade, local_date date not null,
 level text not null references public.learning_levels(code),
 episode_id text references public.listening_episodes(id), primary key(user_id,local_date,level)
);
create table public.listening_saved_vocabulary (
 user_id uuid not null references auth.users(id) on delete cascade,
 vocabulary_id text not null references public.vocabulary(id),
 created_at timestamptz not null default now(), primary key(user_id,vocabulary_id)
);
create table public.listening_reward_claims (
 user_id uuid not null references auth.users(id) on delete cascade, claim_id text not null,
 xp integer not null check(xp in (0,15)), coins integer not null check(coins in (0,10)),
 seed text check(seed is null or seed='lavender'), delivered_at timestamptz,
 primary key(user_id,claim_id)
);
create index listening_episode_filter on public.listening_episodes(level,category_id,content_status);
create index listening_progress_recent on public.listening_progress(user_id,last_at desc);
create index listening_attempt_recent on public.listening_quiz_attempts(user_id,episode_id,started_at desc);
do $$
declare t text;
begin
 foreach t in array array['listening_categories','listening_episodes','listening_audio_assets','listening_transcripts','listening_questions'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select on public.%I to anon, authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy catalog_read on public.%I for select to anon, authenticated using(true)',t);
 end loop;
 foreach t in array array['listening_progress','listening_quiz_attempts','listening_daily_assignments','listening_reward_claims'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy own_read on public.%I for select to authenticated using((select auth.uid())=user_id)',t);
 end loop;
 foreach t in array array['listening_favorites','listening_saved_vocabulary'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select,insert,delete on public.%I to authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy own_read on public.%I for select to authenticated using((select auth.uid())=user_id)',t);
 execute format('create policy own_insert on public.%I for insert to authenticated with check((select auth.uid())=user_id)',t);
 execute format('create policy own_delete on public.%I for delete to authenticated using((select auth.uid())=user_id)',t);
 end loop;
end $$;
alter table public.listening_question_answers enable row level security;
revoke all on public.listening_question_answers from anon, authenticated;
grant all on public.listening_question_answers to service_role;
-- The existing exercise_xp_transactions ledger already allows 5/15 XP after step 6.
-- Production playback/quiz verification and awarding require a trusted server transaction.
commit;
