-- Add category_id column to products table
alter table products add column if not exists category_id uuid references categories(id);

-- Add foreign key constraint
alter table products add constraint fk_products_category
  foreign key (category_id)
  references categories(id)
  on delete set null;

-- Update RLS policies to include category_id
drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone"
  on products for select
  using (true);

drop policy if exists "Products are insertable by authenticated users" on products;
create policy "Products are insertable by authenticated users"
  on products for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Products are updatable by authenticated users" on products;
create policy "Products are updatable by authenticated users"
  on products for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Products are deletable by authenticated users" on products;
create policy "Products are deletable by authenticated users"
  on products for delete
  using (auth.role() = 'authenticated'); 