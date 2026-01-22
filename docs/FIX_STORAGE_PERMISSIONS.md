# Supabase Storage Setup (SQL Method)

The easiest way to fix the "new row violates row-level security policy" error is to run this SQL script. This will ensure your `plans` bucket exists and has the correct permissions.

## 1. Go to SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

## 2. Run this Script
Copy and paste this code, then click **Run**:

```sql
-- 1. Create the 'plans' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('plans', 'plans', true)
on conflict (id) do update set public = true;

-- 2. Allow public access to view files (SELECT)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'plans' );

-- 3. Allow authenticated users to upload files (INSERT)
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'plans' and auth.role() = 'authenticated' );

-- 4. Allow users to update/delete their own files (Optional but good)
drop policy if exists "Owner Update" on storage.objects;
create policy "Owner Update"
  on storage.objects for update
  using ( bucket_id = 'plans' and auth.uid() = owner );

drop policy if exists "Owner Delete" on storage.objects;
create policy "Owner Delete"
  on storage.objects for delete
  using ( bucket_id = 'plans' and auth.uid() = owner );
```

## 3. Verify
After running the script, go back to your app and try uploading the floor plan again. It should work instantly!
