import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download, 
  Eye, 
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResumeManagement = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeScore, setResumeScore] = useState(72);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setUploadedFile(file);
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file.",
        variant: "destructive",
      });
    }
  };

  const handleAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Resume generated",
        description: "Your resume has been auto-generated from your profile.",
      });
    }, 2000);
  };

  const improvements = [
    {
      type: "critical",
      title: "Add quantifiable achievements",
      description: "Include numbers and metrics in your experience descriptions (e.g., 'Increased efficiency by 30%')",
    },
    {
      type: "warning",
      title: "Skills section needs expansion",
      description: "Add 3-5 more relevant technical skills that match your target internships",
    },
    {
      type: "info",
      title: "Consider adding a summary",
      description: "A brief professional summary at the top can help highlight your key strengths",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ApplicantSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Resume Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload, manage, and optimize your resume
              </p>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Current Resume Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Your Resume</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {uploadedFile ? uploadedFile.name : "No resume uploaded yet"}
                      </p>
                    </div>
                    {uploadedFile && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {uploadedFile && (
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Resume Score</span>
                          <span className="text-2xl font-bold text-primary">{resumeScore}%</span>
                        </div>
                        <Progress value={resumeScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Upload/Generate Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Manage Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                      <TabsTrigger value="generate">Auto-Generate</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Upload your resume</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop or click to browse
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="max-w-xs mx-auto cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports PDF and DOC formats
                        </p>
                      </div>
                      {uploadedFile && (
                        <Button className="w-full">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Save Resume
                        </Button>
                      )}
                    </TabsContent>

                    <TabsContent value="generate" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-4 bg-accent rounded-lg">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <p className="text-sm">
                            Generate a professional resume using your profile information
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder="+1 234 567 8900" />
                          </div>
                          <div>
                            <Label htmlFor="summary">Professional Summary</Label>
                            <Textarea 
                              id="summary" 
                              placeholder="Brief description of your skills and experience..."
                              rows={3}
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={handleAutoGenerate}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Resume
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              {uploadedFile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      AI Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {improvements.map((improvement, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 border border-border rounded-lg"
                        >
                          {improvement.type === "critical" && (
                            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          )}
                          {improvement.type === "warning" && (
                            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          )}
                          {improvement.type === "info" && (
                            <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{improvement.title}</h4>
                              <Badge
                                variant={
                                  improvement.type === "critical"
                                    ? "destructive"
                                    : improvement.type === "warning"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {improvement.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {improvement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResumeManagement;
