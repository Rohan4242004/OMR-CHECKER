import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Users, 
  BarChart3, 
  Download, 
  Plus,
  Eye,
  Settings,
  Calendar
} from "lucide-react";

const AdminDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [answerKey, setAnswerKey] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const { toast } = useToast();

  const stats = [
    { label: "Total Exams", value: "24", icon: <FileText className="w-5 h-5" />, color: "text-primary" },
    { label: "Students Enrolled", value: "1,250", icon: <Users className="w-5 h-5" />, color: "text-secondary-accent" },
    { label: "Sheets Processed", value: "8,439", icon: <BarChart3 className="w-5 h-5" />, color: "text-success" },
    { label: "Avg. Accuracy", value: "99.2%", icon: <Eye className="w-5 h-5" />, color: "text-warning" }
  ];

  const recentExams = [
    { id: 1, title: "Mathematics Final Exam", date: "2024-01-15", students: 45, processed: 43, status: "Completed" },
    { id: 2, title: "Physics Quiz #3", date: "2024-01-14", students: 38, processed: 38, status: "Completed" },
    { id: 3, title: "Chemistry Midterm", date: "2024-01-13", students: 52, processed: 50, status: "Processing" },
    { id: 4, title: "Biology Lab Test", date: "2024-01-12", students: 29, processed: 29, status: "Completed" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} has been selected for upload.`,
      });
    }
  };

  const handleSubmitAnswerKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !answerKey || !examTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Answer Key Uploaded",
      description: `Answer key for "${examTitle}" has been successfully uploaded and processed.`,
    });

    // Reset form
    setSelectedFile(null);
    setAnswerKey("");
    setExamTitle("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "Processing": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage exams, upload answer keys, and monitor student progress</p>
          </div>
          <div className="flex gap-2 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Exam
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0 gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg gradient-hero text-white ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Answer Key */}
          <Card className="shadow-card border-0 gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Answer Key
              </CardTitle>
              <CardDescription>
                Upload the correct answer key for a new exam or test.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswerKey} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input
                    id="exam-title"
                    placeholder="e.g., Mathematics Final Exam"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer-key">Answer Key</Label>
                  <Textarea
                    id="answer-key"
                    placeholder="Enter the correct answers (e.g., 1:A, 2:B, 3:C, 4:D, 5:A...)"
                    value={answerKey}
                    onChange={(e) => setAnswerKey(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-file">OMR Template (Optional)</Label>
                  <Input
                    id="template-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Answer Key
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card className="shadow-card border-0 gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Exams
              </CardTitle>
              <CardDescription>
                Monitor the latest exam submissions and processing status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <h4 className="font-medium">{exam.title}</h4>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.processed}/{exam.students} sheets processed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View All Exams
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;