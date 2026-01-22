# Supabase Storage Setup for Photos

Run this SQL script in your Supabase SQL Editor to creating the `photos` bucket and set permissions.

```sql
-- 1. Create the 'photos' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

-- 2. Allow public access to view files (SELECT)
drop policy if exists "Public Access Photos" on storage.objects;
create policy "Public Access Photos"
  on storage.objects for select
  using ( bucket_id = 'photos' );

-- 3. Allow authenticated users to upload files (INSERT)
drop policy if exists "Authenticated Upload Photos" on storage.objects;
create policy "Authenticated Upload Photos"
  on storage.objects for insert
  with check ( bucket_id = 'photos' and auth.role() = 'authenticated' );

-- 4. Allow users to update/delete their own files
drop policy if exists "Owner Update Photos" on storage.objects;
create policy "Owner Update Photos"
  on storage.objects for update
  using ( bucket_id = 'photos' and auth.uid() = owner );

drop policy if exists "Owner Delete Photos" on storage.objects;
create policy "Owner Delete Photos"
  on storage.objects for delete
  using ( bucket_id = 'photos' and auth.uid() = owner );
```

## Next Steps
After running this script, I will:
1. Update `lib/api.ts` to handle photo uploads
2. Update `PhotosTab` to allow uploading
3. Update the Project Wizard to save photos automatically
