import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSubmissions } from "@/hooks/useSubmissions";
import { AnswerKeyUpload } from "./AnswerKeyUpload";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Eye,
  TrendingUp,
  BookOpen,
  Camera,
  Settings,
  Zap,
  XCircle
} from "lucide-react";

const StudentDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examName, setExamName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [answerKey, setAnswerKey] = useState<Array<{ question: number; correct: string }>>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { submissions, isLoading, uploadMutation, stats: submissionStats } = useSubmissions();

  const stats = [
    { label: "Total Submissions", value: submissionStats.totalSubmissions.toString(), icon: <BookOpen className="w-5 h-5" />, color: "text-primary" },
    { label: "Average Score", value: `${submissionStats.averageScore}%`, icon: <TrendingUp className="w-5 h-5" />, color: "text-success" },
    { label: "Avg. Processing Time", value: "4.2s", icon: <Clock className="w-5 h-5" />, color: "text-warning" },
    { label: "Accuracy Rate", value: "98%", icon: <CheckCircle className="w-5 h-5" />, color: "text-secondary-accent" }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
        toast({
          title: "File Selected",
          description: `${file.name} has been selected for upload.`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image (JPG, PNG) or PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} has been selected for upload.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an OMR sheet to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!examName.trim()) {
      toast({
        title: "Exam Name Required",
        description: "Please enter the exam name.",
        variant: "destructive",
      });
      return;
    }

    await uploadMutation.mutateAsync({ 
      file: selectedFile, 
      examName,
      answerKey: answerKey.length > 0 ? answerKey : undefined
    });
    setSelectedFile(null);
    setExamName("");
    setAnswerKey([]);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Upload OMR sheets with advanced AI processing & instant results</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="mr-2 h-4 w-4" />
              Pro Features Enabled
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="mr-2 h-4 w-4" />
              Last active: 2 hours ago
            </Badge>
          </div>
        </div>

        {/* Process Steps Indicator */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[
                { icon: Upload, label: "Upload Sheet", status: "active" },
                { icon: Settings, label: "Auto-Detection", status: "pending" },
                { icon: Zap, label: "AI Processing", status: "pending" },
                { icon: Eye, label: "View Results", status: "pending" }
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.status === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    step.status === 'active' ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0 gradient-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg gradient-hero text-white ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Upload Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Upload className="h-6 w-6 text-primary" />
              Upload OMR Answer Sheet
            </CardTitle>
            <CardDescription className="text-base">
              Upload a clear, high-quality image of your completed OMR answer sheet for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Drop your OMR sheet here
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    or click to browse from your computer
                  </p>
                  <Button size="lg" variant="outline" className="mb-6">
                    <Camera className="mr-2 h-5 w-5" />
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-solid border-primary rounded-xl p-6 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedFile.name}</h4>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Advanced Mathematics Final"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Questions
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="200"
                    placeholder="100"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 100)}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <AnswerKeyUpload 
                    onAnswerKeyParsed={setAnswerKey}
                    totalQuestions={totalQuestions}
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1" 
                    size="lg"
                    disabled={uploadMutation.isPending}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {uploadMutation.isPending ? 'Uploading...' : 'Submit for Processing'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quality Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <div className="font-semibold text-green-800">High Quality Images</div>
                  <div className="text-sm text-green-600">300 DPI or higher recommended</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Camera className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-blue-800">Clear & Straight</div>
                  <div className="text-sm text-blue-600">Ensure the sheet is well-lit and flat</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <div className="font-semibold text-purple-800">Multiple Formats</div>
                  <div className="text-sm text-purple-600">JPG, PNG, WebP supported</div>
                </div>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Enhanced Recent Submissions */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-primary" />
              Recent Submissions & Analytics
            </CardTitle>
            <CardDescription className="text-base">
              Track your progress with detailed performance analytics and submission history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">12</div>
                <div className="text-sm text-blue-600">Total Submissions</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">87%</div>
                <div className="text-sm text-green-600">Average Score</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">4.2s</div>
                <div className="text-sm text-purple-600">Avg. Processing Time</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">98%</div>
                <div className="text-sm text-orange-600">Accuracy Rate</div>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading submissions...
                </div>
              ) : !submissions || submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">No submissions yet. Upload your first OMR sheet to get started!</p>
                  {!submissions && (
                    <Button asChild variant="outline">
                      <Link to="/login">Login to View Submissions</Link>
                    </Button>
                  )}
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{submission.exam_name}</h4>
                        <p className="text-sm text-gray-500">
                          Submitted on {format(new Date(submission.created_at), 'MMMM dd, yyyy')}
                        </p>
                        {submission.status === 'processing' && (
                          <div className="mt-2">
                            <Progress value={75} className="w-32 h-2" />
                            <span className="text-xs text-gray-500 mt-1">Processing... 75%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={submission.status === 'completed' ? 'default' : 
                                submission.status === 'processing' ? 'secondary' : 'destructive'}
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {submission.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {submission.status === 'processing' && <Clock className="h-3 w-3" />}
                        {submission.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                      {submission.score !== null && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{submission.score}</div>
                          <div className="text-xs text-gray-500">out of 100</div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {submission.status === 'completed' && (
                          <Button size="sm" variant="ghost" className="hover:bg-blue-50" asChild>
                            <Link to={`/results/${submission.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        )}
                        {submission.status === 'completed' && (
                          <Button size="sm" variant="ghost" className="hover:bg-green-50">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;