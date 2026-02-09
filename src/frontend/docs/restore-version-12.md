# Restore to Version 12 - Developer Notes

## Overview
This document describes the steps used to restore the learner app to Draft/Version 12 behavior in this environment.

## What Changed in Version 12 Restore

### 1. Dummy OTP Authentication Flow
- **Auto-fill OTP**: After "Send OTP" succeeds, the OTP input is automatically filled with a dummy code (`123456`)
- **Auto-verify**: Verification starts automatically after a short delay (500ms)
- **Direct routing**: After successful verification, users are routed directly to the Course Dashboard
- **No profile gating**: Profile creation is no longer required before accessing the app

### 2. Configuration Files Added
- `frontend/src/config/auth.ts`: Contains dummy OTP constant and auto-verify delay configuration

### 3. Component Changes
- **OtpAuthFlow.tsx**: 
  - Removed profile creation step from auth flow
  - Added auto-fill and auto-verify logic using `useEffect`
  - Added loading states for auto-verification process
  - Direct navigation to dashboard on success
  
- **App.tsx**:
  - Removed profile setup gating logic
  - Removed `useGetCallerUserProfile` dependency for routing decisions
  - Authenticated users now go directly to the authenticated shell and dashboard

### 4. Session Management
- Session persistence via localStorage remains unchanged
- Token and phone number are stored and restored on reload
- Users stay authenticated across page reloads

## Expected Behavior

### First-Time User Flow
1. User enters phone number
2. Taps "Send OTP"
3. OTP input auto-fills with `123456`
4. Verification starts automatically after 500ms
5. User lands on Course Dashboard
6. No profile creation required

### Returning User Flow
1. App loads with stored session
2. User lands directly on Course Dashboard
3. No login required

### Error Handling
- If auto-verification fails, user sees error message
- OTP input is cleared to allow manual retry
- User can change phone number if needed

## Technical Implementation

### Auto-fill Logic
