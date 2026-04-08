import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { submissionId } = await req.json();

    if (!submissionId) {
      throw new Error('Submission ID is required');
    }

    // Get submission details with answer key
    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }

    // Download the OMR sheet image
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('omr-sheets')
      .download(submission.file_url);

    if (downloadError) {
      throw new Error('Failed to download OMR sheet');
    }

    // Convert file to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Process in chunks to avoid stack overflow
    let binaryString = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      binaryString += String.fromCharCode(...chunk);
    }
    const base64Image = btoa(binaryString);

    // Call Lovable AI to analyze the OMR sheet
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this OMR (Optical Mark Recognition) answer sheet. The sheet contains ${submission.total_questions} multiple-choice questions with options A, B, C, and D. 

For each question, identify:
1. The question number
2. Which option (A, B, C, or D) is marked by the student
3. If no option is clearly marked, indicate as "NOT_ANSWERED"

Return ONLY a valid JSON object in this exact format with no additional text:
{
  "answers": [
    {"question": 1, "marked": "A"},
    {"question": 2, "marked": "B"},
    ...
  ]
}

Be precise in detecting which bubbles are filled. A marked bubble should be significantly darker than unmarked ones.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error('Failed to process OMR sheet with AI');
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    // Parse AI response
    let parsedAnswers;
    try {
      // Check if the AI couldn't process the image
      const lowerContent = aiContent.toLowerCase();
      
      if (lowerContent.includes('template') && lowerContent.includes('not contain any filled')) {
        // Update submission status to failed with helpful message
        await supabaseClient
          .from('submissions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', submissionId);

        return new Response(
          JSON.stringify({ 
            error: 'This appears to be a blank OMR template. Please upload a completed answer sheet with filled bubbles.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (lowerContent.includes('cannot process') || 
          lowerContent.includes('too blurry') ||
          lowerContent.includes('not discernible')) {
        // Update submission status to failed with helpful message
        await supabaseClient
          .from('submissions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', submissionId);

        return new Response(
          JSON.stringify({ 
            error: 'Image quality too low. Please upload a clear, high-resolution image of the OMR sheet.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract JSON from response (in case there's extra text)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      parsedAnswers = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse AI response:', aiContent);
      
      // Update submission to failed
      await supabaseClient
        .from('submissions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      throw new Error('Unable to process OMR sheet. Please ensure the image is clear and properly formatted.');
    }

    // Use uploaded answer key if available, otherwise generate random
    let answerKey;
    if (submission.answer_key && Array.isArray(submission.answer_key)) {
      answerKey = submission.answer_key;
    } else {
      // Generate mock answer key for demo purposes
      answerKey = Array.from({ length: submission.total_questions }, (_, i) => {
        const options = ['A', 'B', 'C', 'D'];
        return {
          question: i + 1,
          correct: options[Math.floor(Math.random() * options.length)]
        };
      });
    }

    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionResults = parsedAnswers.answers.map((answer: any) => {
      const correctAnswer = answerKey.find((k: any) => k.question === answer.question)?.correct || 'A';
      const isCorrect = answer.marked === correctAnswer;
      const isUnanswered = answer.marked === 'NOT_ANSWERED' || !answer.marked;

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        submission_id: submissionId,
        question_number: answer.question,
        marked_answer: isUnanswered ? null : answer.marked,
        correct_answer: correctAnswer,
        is_correct: isUnanswered ? null : isCorrect
      };
    });

    // Calculate score
    const score = Math.round((correctCount / submission.total_questions) * 100);

    // Update submission
    const { error: updateError } = await supabaseClient
      .from('submissions')
      .update({
        status: 'completed',
        score,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        unanswered: unansweredCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateError) {
      throw updateError;
    }

    // Insert question results
    const { error: resultsError } = await supabaseClient
      .from('question_results')
      .insert(questionResults);

    if (resultsError) {
      throw resultsError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        score,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unanswered: unansweredCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing OMR:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
