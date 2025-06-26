-- Script to promote the first user to admin role
-- Run this after signing in through Replit OAuth

-- Check current users
SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at ASC;

-- Promote the first user to admin (replace with actual user ID after sign-in)
-- UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = 'USER_ID_HERE';

-- Alternative: Promote the first user automatically
UPDATE users SET role = 'admin', updated_at = NOW() 
WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);

-- Verify the change
SELECT id, email, first_name, last_name, role FROM users WHERE role = 'admin';