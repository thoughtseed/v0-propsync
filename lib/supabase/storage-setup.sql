-- Create properties bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload to properties bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- Allow users to read files they uploaded
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'properties' AND owner = auth.uid());

-- Allow users to update files they uploaded
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'properties' AND owner = auth.uid());

-- Allow users to delete files they uploaded
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'properties' AND owner = auth.uid());

-- Allow public access to files (optional, remove if you want files to be private)
CREATE POLICY "Public can view all files in properties bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'properties');
