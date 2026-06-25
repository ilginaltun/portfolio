-- 1. Enable Row Level Security (RLS) on the 'books' table
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows EVERYONE (public) to VIEW (SELECT) books
CREATE POLICY "Allow Public Read Access"
ON books
FOR SELECT
TO public
USING (true);

-- 3. Create a policy that allows only AUTHENTICATED users to INSERT, UPDATE, and DELETE
CREATE POLICY "Allow Admin Full Access"
ON books
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Note: This assumes you are the only authenticated user. 
-- IMPORTANT: Go to Supabase > Authentication > Providers > Email and disable "Confirm email" if you want generally easier login,
-- BUT MORE IMPORTANTLY: Go to Authentication > Settings > User Signups and DISABLE "Allow new user signups" 
-- after you have created your account. This ensures no one else can sign up and become an "authenticated" user.
