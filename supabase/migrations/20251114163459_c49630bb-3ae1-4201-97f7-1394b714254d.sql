-- Create enum for submission status
CREATE TYPE submission_status AS ENUM ('processing', 'completed', 'failed');

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'processing',
  score INTEGER,
  total_questions INTEGER DEFAULT 100,
  correct_answers INTEGER,
  incorrect_answers INTEGER,
  unanswered INTEGER,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question_results table for detailed analysis
CREATE TABLE public.question_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  marked_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_results ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Users can view their own submissions" 
ON public.submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
ON public.submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
ON public.submissions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for question_results
CREATE POLICY "Users can view their own question results" 
ON public.question_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.submissions 
  WHERE submissions.id = question_results.submission_id 
  AND submissions.user_id = auth.uid()
));

CREATE POLICY "Users can create question results for their submissions" 
ON public.question_results 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.submissions 
  WHERE submissions.id = question_results.submission_id 
  AND submissions.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_question_results_submission_id ON public.question_results(submission_id);