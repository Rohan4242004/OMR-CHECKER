-- Add answer_key column to submissions table to store uploaded answer keys
ALTER TABLE public.submissions 
ADD COLUMN answer_key JSONB;

COMMENT ON COLUMN public.submissions.answer_key IS 'User-uploaded answer key in JSON format: [{"question": 1, "correct": "A"}, ...]';