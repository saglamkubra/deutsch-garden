-- Step 5 schema preparation only. Not executed; remote adapter and authoritative RPC are future configuration work.
begin;
create table public.exercise_question_types (
 id text primary key check(id in ('choice','blank','matching','sentence','tr-de','de-tr','listening')),
 title_tr text not null
);
insert into public.exercise_question_types values
 ('choice','Çoktan Seçmeli'),('blank','Boşluk Doldurma'),('matching','Kelime Eşleştirme'),
 ('sentence','Cümle Oluşturma'),('tr-de','Türkçeden Almancaya'),('de-tr','Almancadan Türkçeye'),('listening','Dinleme');
create table public.exercise_questions (
 id text primary key, type_id text not null references public.exercise_question_types(id),
 level text not null references public.learning_levels(code), vocabulary_ids text[] not null,
 prompt text not null, public_payload jsonb not null default '{}', content_version integer not null default 1
);
-- Accepted answers are deliberately not part of the anonymous/public question payload.
create table public.exercise_correct_answers (
 question_id text primary key references public.exercise_questions(id) on delete cascade,
 accepted jsonb not null, explanation_tr text not null
);
create table public.exercise_sessions (
 id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 local_date date not null, level text not null references public.learning_levels(code),
 mode text not null, question_ids text[] not null, position integer not null default 0 check(position>=0),
 started_at timestamptz not null default now(), completed_at timestamptz, result jsonb,
 unique(user_id,id)
);
create table public.exercise_user_answers (
 user_id uuid not null references auth.users(id) on delete cascade,
 session_id uuid not null, question_id text not null references public.exercise_questions(id),
 answer jsonb not null, correct boolean not null, answered_at timestamptz not null default now(),
 primary key(user_id,session_id,question_id),
 foreign key(user_id,session_id) references public.exercise_sessions(user_id,id) on delete cascade
);
create table public.exercise_attempts (
 id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 session_id uuid not null, question_id text not null references public.exercise_questions(id),
 attempt jsonb not null, created_at timestamptz not null default now(),
 foreign key(user_id,session_id) references public.exercise_sessions(user_id,id) on delete cascade
);
create table public.exercise_daily_assignments (
 user_id uuid not null references auth.users(id) on delete cascade,
 local_date date not null, level text not null references public.learning_levels(code), session_id uuid not null,
 primary key(user_id,local_date,level),
 foreign key(user_id,session_id) references public.exercise_sessions(user_id,id) on delete cascade
);
create table public.exercise_xp_transactions (
 user_id uuid not null references auth.users(id) on delete cascade, claim_id text not null,
 amount integer not null check(amount=5), created_at timestamptz not null default now(),
 primary key(user_id,claim_id)
);
create table public.exercise_reward_claims (
 user_id uuid not null references auth.users(id) on delete cascade, claim_id text not null,
 coins integer not null default 0 check(coins in (0,10)), seed text check(seed is null or seed='lavender'),
 delivered_at timestamptz, primary key(user_id,claim_id)
);
create table public.exercise_learning_mistakes (
 user_id uuid not null references auth.users(id) on delete cascade,
 vocabulary_id text not null references public.vocabulary(id), wrong_count integer not null default 0 check(wrong_count>=0),
 right_count integer not null default 0 check(right_count>=0), last_at timestamptz not null,
 primary key(user_id,vocabulary_id)
);
create index exercise_sessions_owner_date on public.exercise_sessions(user_id,local_date);
create index exercise_mistakes_priority on public.exercise_learning_mistakes(user_id,wrong_count desc);
do $$
declare t text;
begin
 foreach t in array array['exercise_question_types','exercise_questions'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select on public.%I to anon, authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy catalog_read on public.%I for select to anon, authenticated using(true)',t);
 end loop;
 -- Correctness, XP and reward claims require a future server-side grading transaction.
 -- Clients receive read-own access only; no user can self-award with direct inserts.
 foreach t in array array['exercise_sessions','exercise_user_answers','exercise_attempts','exercise_daily_assignments','exercise_xp_transactions','exercise_reward_claims','exercise_learning_mistakes'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy own_read on public.%I for select to authenticated using ((select auth.uid())=user_id)',t);
 end loop;
end $$;
alter table public.exercise_correct_answers enable row level security;
revoke all on public.exercise_correct_answers from anon, authenticated;
grant all on public.exercise_correct_answers to service_role;
commit;
