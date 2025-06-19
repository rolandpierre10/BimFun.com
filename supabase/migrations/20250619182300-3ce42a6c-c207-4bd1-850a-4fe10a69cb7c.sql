
-- Create storage buckets for different media types
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('user-photos', 'user-photos', true),
  ('user-videos', 'user-videos', true),
  ('user-music', 'user-music', true),
  ('user-series', 'user-series', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for user media storage
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload music" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload series" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view all media" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload music" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-music' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload series" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-series' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to view all media" ON storage.objects
FOR SELECT USING (bucket_id IN ('user-photos', 'user-videos', 'user-music', 'user-series'));

-- Create publications table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'video', 'music', 'series', 'announcement')),
  media_urls JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on publications
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policies for publications
CREATE POLICY "Users can view public publications" ON public.publications
FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own publications" ON public.publications
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" ON public.publications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" ON public.publications
FOR DELETE USING (auth.uid() = user_id);

-- Create publication interactions table
CREATE TABLE IF NOT EXISTS public.publication_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  publication_id UUID NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'view', 'share')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, publication_id, interaction_type)
);

-- Enable RLS on publication interactions
ALTER TABLE public.publication_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for publication interactions
CREATE POLICY "Users can view all interactions" ON public.publication_interactions
FOR SELECT USING (true);

CREATE POLICY "Users can create interactions" ON public.publication_interactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON public.publication_interactions
FOR UPDATE USING (auth.uid() = user_id);

-- Create publication comments table
CREATE TABLE IF NOT EXISTS public.publication_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  publication_id UUID NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.publication_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on publication comments
ALTER TABLE public.publication_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for publication comments
CREATE POLICY "Users can view all comments" ON public.publication_comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.publication_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.publication_comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.publication_comments
FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for publications
ALTER TABLE public.publications REPLICA IDENTITY FULL;
ALTER TABLE public.publication_interactions REPLICA IDENTITY FULL;
ALTER TABLE public.publication_comments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.publications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.publication_interactions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.publication_comments;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;
