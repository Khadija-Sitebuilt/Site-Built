# Exports Storage Bucket Setup

This document contains the SQL commands needed to set up the `exports` bucket in Supabase Storage for storing generated export reports.

## Run in Supabase SQL Editor

```sql
-- Create the exports bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read exported files
CREATE POLICY "Public Access for Exports"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'exports');

-- Allow authenticated users to upload exports (backend uses service key)
CREATE POLICY "Allow Authenticated Upload to Exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exports');

-- Allow authenticated users to update exports
CREATE POLICY "Allow Authenticated Update to Exports"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'exports');
```

## Verification

After running the SQL:
1. Go to Supabase Dashboard → Storage
2. You should see the `exports` bucket listed
3. It should be marked as "Public"
4. Try generating an export from your app

## Bucket Details
- **Name**: `exports`
- **Public**: Yes (allows public URL access)
- **Purpose**: Stores generated HTML export reports
- **File naming**: `{project_id}/export_{uuid}.html`
