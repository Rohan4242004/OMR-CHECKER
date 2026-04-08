import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PerformanceChartProps {
  currentScore: number;
  previousScores: Array<{
    exam_name: string;
    score: number;
    created_at: string;
  }>;
}

export const PerformanceChart = ({ currentScore, previousScores }: PerformanceChartProps) => {
  const chartData = [
    ...previousScores.map((s, index) => ({
      name: `Exam ${index + 1}`,
      score: s.score,
      exam: s.exam_name
    })),
    {
      name: 'Current',
      score: currentScore,
      exam: 'Current Exam'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.exam}</p>
                      <p className="text-primary">Score: {payload[0].value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface QuestionAnalysisChartProps {
  questionResults: Array<{
    question_number: number;
    is_correct: boolean | null;
    marked_answer: string | null;
    correct_answer: string;
  }>;
}

export const QuestionAnalysisChart = ({ questionResults }: QuestionAnalysisChartProps) => {
  // Group questions by every 10 for better visualization
  const groupedData = [];
  for (let i = 0; i < questionResults.length; i += 10) {
    const group = questionResults.slice(i, Math.min(i + 10, questionResults.length));
    const correct = group.filter(q => q.is_correct === true).length;
    const incorrect = group.filter(q => q.is_correct === false).length;
    const unanswered = group.filter(q => q.is_correct === null).length;
    
    groupedData.push({
      range: `Q${i + 1}-${Math.min(i + 10, questionResults.length)}`,
      correct,
      incorrect,
      unanswered
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question-wise Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="correct" fill="hsl(var(--success))" name="Correct" />
            <Bar dataKey="incorrect" fill="hsl(var(--destructive))" name="Incorrect" />
            <Bar dataKey="unanswered" fill="hsl(var(--warning))" name="Unanswered" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
