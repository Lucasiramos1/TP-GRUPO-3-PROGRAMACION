create table public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  category text not null check (char_length(trim(category)) between 2 and 60),
  description text check (description is null or char_length(trim(description)) <= 200),
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index finance_transactions_user_month_idx
  on public.finance_transactions (user_id, occurred_on desc);

alter table public.finance_transactions enable row level security;

revoke all on table public.finance_transactions from anon;
grant select, insert, update, delete on table public.finance_transactions to authenticated;

create policy "Users can read their own finance transactions"
  on public.finance_transactions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own finance transactions"
  on public.finance_transactions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own finance transactions"
  on public.finance_transactions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own finance transactions"
  on public.finance_transactions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
