import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams, Link } from "react-router-dom";
import { useSubmissionDetail } from "@/hooks/useSubmissionDetail";
import { PerformanceChart, QuestionAnalysisChart } from "./PerformanceChart";
import { exportToCSV, exportToPDF } from "@/utils/exportResults";
import { format } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  Download, 
  ArrowLeft,
  BarChart3,
  FileText,
  Calendar,
  Loader2
} from "lucide-react";

const ResultsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { submission, questionResults, previousSubmissions, isLoading } = useSubmissionDetail(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission || !questionResults) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested results could not be found.</p>
          <Button asChild>
            <Link to="/student">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'wrong':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'unanswered':
        return <MinusCircle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-success/10 text-success border-success/20';
      case 'wrong':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'unanswered':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const downloadResults = (format: 'csv' | 'pdf') => {
    if (!submission || !questionResults) return;
    
    if (format === 'csv') {
      exportToCSV(submission, questionResults);
    } else {
      exportToPDF(submission, questionResults);
    }
  };

  const getQuestionStatus = (result: typeof questionResults[0]) => {
    if (result.is_correct === null) return 'unanswered';
    return result.is_correct ? 'correct' : 'wrong';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/student">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{submission.exam_name}</h1>
            <p className="text-muted-foreground">Detailed Results Analysis</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {submission.score}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-lg font-medium mt-1">
                {submission.correct_answers}/{submission.total_questions}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {submission.correct_answers}
              </div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <div className="flex items-center justify-center mt-2">
                <CheckCircle className="w-4 h-4 text-success mr-1" />
                <span className="text-sm">
                  {Math.round((submission.correct_answers! / submission.total_questions!) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-destructive mb-2">
                {submission.incorrect_answers}
              </div>
              <p className="text-sm text-muted-foreground">Wrong Answers</p>
              <div className="flex items-center justify-center mt-2">
                <XCircle className="w-4 h-4 text-destructive mr-1" />
                <span className="text-sm">
                  {Math.round((submission.incorrect_answers! / submission.total_questions!) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-warning mb-2">
                {submission.unanswered}
              </div>
              <p className="text-sm text-muted-foreground">Unanswered</p>
              <div className="flex items-center justify-center mt-2">
                <MinusCircle className="w-4 h-4 text-warning mr-1" />
                <span className="text-sm">
                  {Math.round((submission.unanswered! / submission.total_questions!) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        {previousSubmissions && previousSubmissions.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <PerformanceChart 
              currentScore={submission.score!}
              previousScores={previousSubmissions}
            />
            <QuestionAnalysisChart questionResults={questionResults} />
          </div>
        )}

        {/* Exam Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exam Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Submission Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(submission.created_at), 'MMMM dd, yyyy - hh:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Total Questions</p>
                  <p className="text-sm text-muted-foreground">{submission.total_questions} questions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Download Results</CardTitle>
            <CardDescription>Export your results in different formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={() => downloadResults('pdf')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={() => downloadResults('csv')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Question-by-Question Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of each question's result
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {questionResults.map((result) => {
                const status = getQuestionStatus(result);
                return (
                  <div
                    key={result.question_number}
                    className={`relative p-3 rounded-lg border-2 ${getStatusColor(status)} hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-sm font-bold">Q{result.question_number}</div>
                      {getStatusIcon(status)}
                      <div className="text-xs text-center">
                        <div>Your: {result.marked_answer || 'N/A'}</div>
                        <div>Ans: {result.correct_answer}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Separator className="my-6" />
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm">Wrong</span>
              </div>
              <div className="flex items-center gap-2">
                <MinusCircle className="h-4 w-4 text-warning" />
                <span className="text-sm">Unanswered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDetail;
