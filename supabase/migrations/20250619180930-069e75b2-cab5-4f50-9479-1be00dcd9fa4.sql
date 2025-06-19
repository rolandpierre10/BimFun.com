
-- Create storage bucket for voice and video messages if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-messages', 'media-messages', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view accessible media" ON storage.objects;

-- Create policy to allow authenticated users to upload media
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media-messages' AND auth.role() = 'authenticated');

-- Create policy to allow users to view media they have access to
CREATE POLICY "Allow users to view accessible media" ON storage.objects
FOR SELECT USING (bucket_id = 'media-messages');

-- Add duration field for voice/video messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Add file size for media messages  
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- Drop existing message policies if they exist
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- Create policies for messages
CREATE POLICY "Users can view messages they sent or received" ON messages
FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

CREATE POLICY "Users can send messages" ON messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (auth.uid() = sender_id);

-- Enable realtime for messages (skip if already enabled)
DO $$
BEGIN
  ALTER TABLE messages REPLICA IDENTITY FULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END$$;

-- Add table to realtime publication (skip if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

-- Drop existing conversation policies if they exist
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Create policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT USING (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT WITH CHECK (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

-- Enable realtime for conversations (skip if already enabled)
DO $$
BEGIN
  ALTER TABLE conversations REPLICA IDENTITY FULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END$$;

-- Add conversations to realtime publication (skip if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;
