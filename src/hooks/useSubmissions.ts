import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSubmissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Realtime subscription for instant updates
  useEffect(() => {
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['submissions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const uploadMutation = useMutation({
    mutationFn: async ({ 
      file, 
      examName, 
      answerKey 
    }: { 
      file: File; 
      examName: string;
      answerKey?: Array<{ question: number; correct: string }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('omr-sheets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create submission record with answer key if provided
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          file_url: fileName,
          exam_name: examName,
          status: 'processing',
          answer_key: answerKey || null
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Trigger edge function to process OMR
      const { error: functionError } = await supabase.functions.invoke('process-omr', {
        body: { submissionId: submission.id }
      });

      if (functionError) throw functionError;

      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Upload Successful',
        description: 'Your OMR sheet is being processed. Results will be ready shortly.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const stats = {
    totalSubmissions: submissions?.length || 0,
    averageScore: submissions?.length 
      ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
      : 0,
    completedCount: submissions?.filter(s => s.status === 'completed').length || 0,
    processingCount: submissions?.filter(s => s.status === 'processing').length || 0
  };

  return {
    submissions,
    isLoading,
    uploadMutation,
    stats
  };
};
