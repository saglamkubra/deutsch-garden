-- Prepared only; no database connection or migration execution is performed by the app.
-- Step 8 reuses the existing learning XP ledger for first story completion (+20).
alter table public.exercise_xp_transactions drop constraint if exists exercise_xp_amount_valid;
alter table public.exercise_xp_transactions drop constraint if exists exercise_xp_transactions_amount_check;
alter table public.exercise_xp_transactions add constraint exercise_xp_amount_valid check (amount in (5,15,20));
-- Story graph content remains repository JSON and versioned localStorage progress.
-- A future authenticated server must validate reward eligibility before inserting receipts.
