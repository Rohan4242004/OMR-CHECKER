import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"submissions">;
type QuestionResult = Tables<"question_results">;

export const exportToCSV = (
  submission: Submission,
  questionResults: QuestionResult[]
) => {
  // Prepare CSV header
  const header = "Question Number,Marked Answer,Correct Answer,Result,Status\n";
  
  // Prepare CSV rows
  const rows = questionResults.map(result => {
    const status = result.is_correct === null 
      ? 'Unanswered' 
      : result.is_correct 
        ? 'Correct' 
        : 'Wrong';
    
    return [
      result.question_number,
      result.marked_answer || 'N/A',
      result.correct_answer,
      status,
      result.is_correct === null ? '-' : result.is_correct ? '✓' : '✗'
    ].join(',');
  }).join('\n');
  
  // Add summary
  const summary = `\n\nSUMMARY\nExam Name,${submission.exam_name}\nTotal Questions,${submission.total_questions}\nScore,${submission.score}%\nCorrect Answers,${submission.correct_answers}\nIncorrect Answers,${submission.incorrect_answers}\nUnanswered,${submission.unanswered}\nDate,${new Date(submission.created_at).toLocaleString()}`;
  
  const csvContent = header + rows + summary;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${submission.exam_name.replace(/\s+/g, '_')}_results.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (
  submission: Submission,
  questionResults: QuestionResult[]
) => {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${submission.exam_name} - Results</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1e40af; margin-bottom: 10px; }
        .meta { color: #666; margin-bottom: 30px; }
        .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .summary-item { text-align: center; }
        .summary-label { font-size: 12px; color: #666; }
        .summary-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1e40af; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        .correct { color: #16a34a; font-weight: bold; }
        .wrong { color: #dc2626; font-weight: bold; }
        .unanswered { color: #f59e0b; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${submission.exam_name}</h1>
      <div class="meta">Generated on ${new Date().toLocaleString()}</div>
      
      <div class="summary">
        <h2>Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Score</div>
            <div class="summary-value">${submission.score}%</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Correct</div>
            <div class="summary-value correct">${submission.correct_answers}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Wrong</div>
            <div class="summary-value wrong">${submission.incorrect_answers}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Unanswered</div>
            <div class="summary-value unanswered">${submission.unanswered}</div>
          </div>
        </div>
      </div>
      
      <h2>Detailed Results</h2>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${questionResults.map(result => {
            const statusClass = result.is_correct === null 
              ? 'unanswered' 
              : result.is_correct 
                ? 'correct' 
                : 'wrong';
            const status = result.is_correct === null 
              ? 'Unanswered' 
              : result.is_correct 
                ? '✓ Correct' 
                : '✗ Wrong';
            
            return `
              <tr>
                <td>${result.question_number}</td>
                <td>${result.marked_answer || 'N/A'}</td>
                <td>${result.correct_answer}</td>
                <td class="${statusClass}">${status}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
