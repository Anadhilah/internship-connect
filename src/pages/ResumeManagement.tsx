import { useState } from "react";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    // Simulate generation
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
      <div className="flex min-h-screen w-full bg-background">
        <ApplicantSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-heading font-semibold">Resume Management</h1>
            </div>
          </header>

          <main className="p-6 animate-fade-in">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Current Resume Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Your Resume</CardTitle>
                      <CardDescription>
                        {uploadedFile ? uploadedFile.name : "No resume uploaded yet"}
                      </CardDescription>
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
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Resume Score</span>
                      <span className="text-2xl font-bold text-primary">{resumeScore}%</span>
                    </div>
                    <Progress value={resumeScore} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Your resume is good! Check the suggestions below to make it excellent.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Main Tabs */}
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                  <TabsTrigger value="generate">Auto-Generate</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Your Resume</CardTitle>
                      <CardDescription>
                        Upload a PDF or DOC file (max 5MB)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="resume-upload"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm font-medium mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, or DOCX (max 5MB)
                          </p>
                        </label>
                      </div>

                      {uploadedFile && (
                        <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}

                      <Button className="w-full" disabled={!uploadedFile}>
                        <Upload className="h-4 w-4 mr-2" />
                        Save Resume
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="generate" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Auto-Generate Resume
                      </CardTitle>
                      <CardDescription>
                        Create a professional resume from your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="+1 234 567 8900" defaultValue="+1 234 567 8900" />
                        </div>

                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Textarea 
                            id="education" 
                            placeholder="Bachelor of Computer Science, University Name, 2020-2024"
                            defaultValue="Bachelor of Computer Science, University Name, 2020-2024"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="skills">Skills (comma separated)</Label>
                          <Input 
                            id="skills" 
                            placeholder="React, TypeScript, Node.js"
                            defaultValue="React, TypeScript, Node.js, Python, SQL"
                          />
                        </div>

                        <div>
                          <Label htmlFor="experience">Experience</Label>
                          <Textarea 
                            id="experience" 
                            placeholder="Describe your work experience, projects, and achievements"
                            defaultValue="Software Development Intern at Tech Corp (Summer 2023)&#10;- Built responsive web applications using React and TypeScript&#10;- Collaborated with senior developers on API integration"
                            rows={6}
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
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    AI Improvement Suggestions
                  </CardTitle>
                  <CardDescription>
                    Recommendations to make your resume stand out
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {improvements.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-lg border border-border hover:shadow-hover transition-shadow">
                      <div className="mt-1">
                        {item.type === "critical" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {item.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {item.type === "info" && <Lightbulb className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant={
                            item.type === "critical" ? "destructive" : 
                            item.type === "warning" ? "default" : 
                            "secondary"
                          }>
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResumeManagement;
