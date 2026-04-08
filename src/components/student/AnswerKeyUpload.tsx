import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileKey, X, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnswerKeyUploadProps {
  onAnswerKeyParsed: (answerKey: Array<{ question: number; correct: string }>) => void;
  totalQuestions: number;
}

export const AnswerKeyUpload = ({ onAnswerKeyParsed, totalQuestions }: AnswerKeyUploadProps) => {
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    // Generate CSV template
    const csvContent = "question,correct_answer\n" + 
      Array.from({ length: totalQuestions }, (_, i) => `${i + 1},A`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'answer_key_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseAnswerKey = async (file: File) => {
    const text = await file.text();
    
    try {
      // Try parsing as JSON first
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        if (Array.isArray(json) && json.every(item => 
          typeof item.question === 'number' && typeof item.correct === 'string'
        )) {
          onAnswerKeyParsed(json);
          return;
        }
      }
      
      // Parse as CSV
      const lines = text.trim().split('\n');
      if (lines.length < 2) throw new Error('Invalid CSV format');
      
      const answerKey: Array<{ question: number; correct: string }> = [];
      
      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const [question, correct] = lines[i].split(',').map(s => s.trim());
        const questionNum = parseInt(question);
        
        if (isNaN(questionNum) || !correct || !['A', 'B', 'C', 'D'].includes(correct.toUpperCase())) {
          throw new Error(`Invalid format at line ${i + 1}. Expected: question_number,answer (A/B/C/D)`);
        }
        
        answerKey.push({ question: questionNum, correct: correct.toUpperCase() });
      }
      
      if (answerKey.length !== totalQuestions) {
        throw new Error(`Answer key has ${answerKey.length} answers but expected ${totalQuestions}`);
      }
      
      onAnswerKeyParsed(answerKey);
      toast({
        title: "Answer Key Loaded",
        description: `Successfully loaded ${answerKey.length} answers`,
      });
    } catch (error) {
      toast({
        title: "Invalid Answer Key",
        description: error instanceof Error ? error.message : "Please check the file format",
        variant: "destructive",
      });
      setAnswerKeyFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV or JSON file",
          variant: "destructive",
        });
        return;
      }
      setAnswerKeyFile(file);
      parseAnswerKey(file);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileKey className="h-5 w-5 text-primary" />
            <Label className="text-sm font-medium">Answer Key (Optional)</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTemplate}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Download Template
          </Button>
        </div>
        
        {answerKeyFile ? (
          <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <FileKey className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{answerKeyFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAnswerKeyFile(null);
                onAnswerKeyParsed([]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
              id="answer-key-upload"
            />
            <Label
              htmlFor="answer-key-upload"
              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="text-sm">Upload CSV or JSON</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-2">
              Format: CSV with columns "question,correct_answer" or JSON array
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
