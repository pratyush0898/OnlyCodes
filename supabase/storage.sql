
-- This will be executed manually in Supabase dashboard

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', true);

-- Set RLS policies for the avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set RLS policies for the post-media bucket
CREATE POLICY "Anyone can view post media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "Authenticated users can upload post media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own post media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
