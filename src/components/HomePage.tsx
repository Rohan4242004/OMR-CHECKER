import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Zap, 
  Shield, 
  BarChart3, 
  CheckCircle, 
  Users, 
  Upload,
  Download,
  Eye,
  ArrowRight,
  Award,
  Clock,
  Play
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: "99.9% AI Accuracy",
      description: "Advanced computer vision algorithms ensure precise bubble detection with machine learning optimization.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Lightning Processing",
      description: "Process hundreds of sheets simultaneously with cloud infrastructure that scales automatically.",
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Enterprise Security",
      description: "Bank-level encryption, GDPR compliance, and audit trails protect sensitive educational data.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Advanced Analytics",
      description: "Real-time dashboards with performance insights, trends analysis, and predictive scoring.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: <Upload className="w-7 h-7" />,
      title: "Multi-Format Support",
      description: "Process JPG, PNG, PDF, TIFF with automatic image enhancement and quality optimization.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: <Download className="w-7 h-7" />,
      title: "Smart Export",
      description: "Export to 10+ formats including Excel, PDF, CSV with custom report templates and branding.",
      color: "text-teal-600",
      bg: "bg-teal-50"
    }
  ];

  const stats = [
    { value: "10M+", label: "Sheets Processed", icon: <FileText className="h-6 w-6" /> },
    { value: "99.9%", label: "Accuracy Rate", icon: <Award className="h-6 w-6" /> },
    { value: "500+", label: "Schools Trust Us", icon: <Users className="h-6 w-6" /> },
    { value: "<5sec", label: "Processing Time", icon: <Clock className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 bg-white/10 border-white/20">
              <Zap className="mr-2 h-4 w-4" />
              Professional OMR Checker Pro
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Advanced Optical Mark
              <br />
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Recognition System
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
              Professional-grade OMR processing with 99.9% accuracy, real-time analytics, and enterprise security.
              Trusted by 500+ educational institutions worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild className="shadow-elevated px-8 py-4 text-lg">
                <Link to="/signup">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="border-white/30 hover:bg-white/10 px-8 py-4 text-lg">
                <Link to="/demo">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Educational Leaders</h2>
            <p className="text-white/90 text-lg">Real numbers from our professional OMR platform</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Professional-Grade Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced capabilities designed for educational excellence and administrative efficiency at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white group hover:scale-[1.02]">
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={feature.color}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Grading Process?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of educators who have revolutionized their assessment workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="shadow-elevated">
              <Link to="/admin">
                <Users className="mr-2 w-5 h-5" />
                Admin Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="border-white/30 hover:bg-white/10">
              <Link to="/student">
                <FileText className="mr-2 w-5 h-5" />
                Student Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;