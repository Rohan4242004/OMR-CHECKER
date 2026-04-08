-- Create storage bucket for OMR sheets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('omr-sheets', 'omr-sheets', false);

-- Allow authenticated users to upload their own OMR sheets
CREATE POLICY "Users can upload their own OMR sheets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'omr-sheets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own OMR sheets
CREATE POLICY "Users can view their own OMR sheets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'omr-sheets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own OMR sheets
CREATE POLICY "Users can delete their own OMR sheets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'omr-sheets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);