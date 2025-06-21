
-- Enable real-time for publications table
ALTER TABLE publications REPLICA IDENTITY FULL;

-- Add publications table to realtime publication
ALTER publication supabase_realtime ADD TABLE publications;
