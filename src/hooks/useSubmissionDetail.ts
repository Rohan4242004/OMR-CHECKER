import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSubmissionDetail = (submissionId: string) => {
  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!submissionId
  });

  const { data: questionResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['question-results', submissionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_results')
        .select('*')
        .eq('submission_id', submissionId)
        .order('question_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!submissionId
  });

  const { data: previousSubmissions, isLoading: previousLoading } = useQuery({
    queryKey: ['previous-submissions', submission?.user_id],
    queryFn: async () => {
      if (!submission) return [];
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', submission.user_id)
        .eq('status', 'completed')
        .neq('id', submissionId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!submission
  });

  return {
    submission,
    questionResults,
    previousSubmissions,
    isLoading: submissionLoading || resultsLoading || previousLoading
  };
};
