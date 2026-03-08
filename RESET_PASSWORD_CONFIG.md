# Password Reset Link Configuration

## Problem
Password reset emails were directing users to `/login` instead of redirecting to `/reset-password`.

## Solution Implemented

### Frontend Changes
1. **Enhanced Login Page** (`app/login/page.tsx`):
   - Added immediate detection of recovery links with `type=recovery` parameter
   - Uses Next.js router to redirect to `/reset-password` while preserving the hash
   - Shows a loading state during redirect
   - More reliable than window.location.replace()

2. **Reset Password Page** (`app/reset-password/page.tsx`):
   - Extracts `access_token` and `refresh_token` from URL hash
   - Establishes Supabase session with provided tokens
   - Allows user to set new password

## How It Works

### Email Link Flow
1. **User requests password reset** → Email sent with Supabase recovery link
2. **Email link format**: `https://sitebuilt.vercel.app/login#access_token=<TOKEN>&refresh_token=<REFRESH>&type=recovery`
3. **User clicks link** → Arrives at login page
4. **Login page detects** `type=recovery` in URL hash
5. **Redirects to** `/reset-password#access_token=<TOKEN>&refresh_token=<REFRESH>&type=recovery`
6. **Reset page extracts tokens** from hash and establishes session
7. **User enters new password** and confirms
8. **Redirects back** to `/login?reset=success`

## Supabase Configuration Required

Make sure your Supabase project is configured to send recovery emails with the correct redirect URL:

### Steps to Verify/Configure in Supabase Dashboard:

1. Go to **Authentication** → **Email Templates**
2. Look for **"Confirm email change"** or **"Reset password"** template
3. Verify the redirect URL is set to:
   ```
   {{ .ConfirmationURL }}
   ```
   This should automatically include `type=recovery` parameter when sent as a recovery email.

### Alternative: Set Custom Redirect URL
If you need to explicitly configure the recovery URL, you can set it in:
1. **Authentication** → **URL Configuration**
2. Set the **Redirect URLs** to include:
   ```
   https://sitebuilt.vercel.app/login
   https://sitebuilt.vercel.app/reset-password
   ```

## Testing the Flow

1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address and submit
4. Check your inbox for the reset email
5. Click the reset link
6. You should be redirected to the reset password page
7. Enter and confirm your new password
8. You should be redirected back to login with a success message

## Troubleshooting

If the redirect isn't working:

1. **Check browser console** for any JavaScript errors
2. **Verify the email link** contains `type=recovery` parameter
3. **Clear browser cache** and try again
4. **Check Supabase email settings** are correctly configured
5. **Ensure Supabase session** can be established with provided tokens

## Files Modified
- `app/login/page.tsx` - Improved recovery link detection and redirect
- `app/reset-password/page.tsx` - Already properly configured (no changes needed)
