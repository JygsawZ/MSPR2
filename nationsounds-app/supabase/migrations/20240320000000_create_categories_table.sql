-- Create the categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a trigger to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger categories_updated_at
  before update on categories
  for each row
  execute function update_updated_at_column();

-- Add RLS policies
alter table categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select
  using (true);

create policy "Categories are insertable by authenticated users"
  on categories for insert
  with check (auth.role() = 'authenticated');

create policy "Categories are updatable by authenticated users"
  on categories for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Categories are deletable by authenticated users"
  on categories for delete
  using (auth.role() = 'authenticated'); 