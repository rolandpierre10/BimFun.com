
-- Make storage buckets public for image sharing
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('user-photos', 'user-videos', 'user-music', 'user-series');

-- Create policies for public access to storage objects
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('user-photos', 'user-videos', 'user-music', 'user-series'));

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('user-photos', 'user-videos', 'user-music', 'user-series'));

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);
