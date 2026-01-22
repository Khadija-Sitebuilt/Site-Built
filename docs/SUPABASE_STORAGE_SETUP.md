# Supabase Storage Setup for Floor Plans

## Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Click **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure:
   - **Name**: `plans`
   - **Public bucket**: ✅ Enabled (so file URLs are publicly accessible)
5. Click **Create bucket**

## Set Up Storage Policies

After creating the bucket, you need to allow authenticated users to upload files:

### Policy 1: Allow Authenticated Uploads

1. Click on the `plans` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **For full customization**
4. Configure the INSERT policy:
   - **Policy name**: `Allow authenticated users to upload`
   - **Policy definition**:
     ```sql
     (auth.role() = 'authenticated')
     ```
   - **Allowed operation**: `INSERT`
5. Click **Review** then **Save policy**

### Policy 2: Allow Public Read Access

1. Click **New Policy** again
2. Configure the SELECT policy:
   - **Policy name**: `Allow public to view files`
   - **Policy definition**:
     ```sql
     true
     ```
   - **Allowed operation**: `SELECT`
3. Click **Review** then **Save policy**

## Test the Upload

After setting up the bucket and policies:

1. Go to your project's **Plans** tab
2. Click **Upload Floor Plan**
3. Select a PNG, JPG, or PDF file
4. The file should upload successfully!

## What Happens

When you upload a plan:
1. ✅ File is uploaded to Supabase Storage bucket `plans`
2. ✅ Public URL is generated
3. ✅ Image dimensions are extracted (for images)
4. ✅ Plan record is created in `plans` table with `file_url`, `width`, `height`
5. ✅ Plan appears in your Plans tab

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket is named exactly `plans` (lowercase)

**Error: "Permission denied"**
- Check that policies are set up correctly
- Make sure user is authenticated

**Upload works but can't see image**
- Check that the bucket is set to **Public**
- Verify the SELECT policy allows public access
