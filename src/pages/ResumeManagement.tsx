import { useState, useEffect } from "react";
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
  Lightbulb,
  Loader2,
  Trash2,
  FileDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProfessionalTemplate, ResumeData } from "@/components/resume/ProfessionalTemplate";

const fileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 20 * 1024 * 1024, "File size must be less than 20MB")
    .refine(
      (file) => 
        file.type === "application/pdf" || 
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Only PDF and DOC/DOCX files are allowed"
    )
});

const ResumeManagement = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  const [resumeScore, setResumeScore] = useState(72);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetchExistingResume();
    fetchProfileData();
  }, []);

  const fetchExistingResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from('intern_profiles')
        .select('resume_url')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (profile?.resume_url) {
        setExistingResumeUrl(profile.resume_url);
      }
    } catch (error: any) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('intern_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (profile) {
        setProfileData(profile);
        // Populate resume data from profile
        setResumeData({
          full_name: profile.full_name || "",
          email: user.email || "",
          phone: "",
          location: "",
          portfolio_url: profile.portfolio_url || "",
          education_level: profile.education_level || "",
          university: profile.university || "",
          field_of_study: profile.field_of_study || "",
          skills: profile.skills || [],
          experience_level: profile.experience_level || "",
          interests: profile.interests || [],
          summary: "",
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      fileSchema.parse({ file });
      setUploadedFile(file);
      
      toast({
        title: "File selected",
        description: `${file.name} is ready to upload.`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid file",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveResume = async () => {
    if (!uploadedFile || !userId) return;

    setIsUploading(true);
    
    try {
      // Delete old resume if exists
      if (existingResumeUrl) {
        const oldPath = existingResumeUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('resumes')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new resume
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('resumes')
        .upload(filePath, uploadedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('intern_profiles')
        .update({ resume_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setExistingResumeUrl(publicUrl);
      setUploadedFile(null);
      
      toast({
        title: "Success!",
        description: "Your resume has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!existingResumeUrl || !userId) return;

    try {
      const fileName = existingResumeUrl.split('/').pop();
      if (!fileName) return;

      const { data, error } = await supabase.storage
        .from('resumes')
        .download(`${userId}/${fileName}`);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your resume is being downloaded.",
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteResume = async () => {
    if (!existingResumeUrl || !userId) return;

    try {
      const fileName = existingResumeUrl.split('/').pop();
      if (!fileName) return;

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([`${userId}/${fileName}`]);

      if (deleteError) throw deleteError;

      // Update profile
      const { error: updateError } = await supabase
        .from('intern_profiles')
        .update({ resume_url: null })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setExistingResumeUrl(null);
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
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

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <ApplicantSidebar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
                        {existingResumeUrl 
                          ? "Resume uploaded" 
                          : uploadedFile 
                          ? uploadedFile.name 
                          : "No resume uploaded yet"}
                      </p>
                    </div>
                    {existingResumeUrl && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadResume}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDeleteResume}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {existingResumeUrl && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Resume uploaded and saved to your profile</span>
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
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                      <TabsTrigger value="build">Build Resume</TabsTrigger>
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
                        <Button 
                          className="w-full" 
                          onClick={handleSaveResume}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Save Resume
                            </>
                          )}
                        </Button>
                      )}
                    </TabsContent>

                    <TabsContent value="build" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-4 bg-accent rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          <p className="text-sm">
                            Build a professional resume using the Classic template
                          </p>
                        </div>

                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="build-name">Full Name *</Label>
                            <Input 
                              id="build-name" 
                              value={resumeData.full_name}
                              onChange={(e) => setResumeData({ ...resumeData, full_name: e.target.value })}
                              placeholder="John Doe" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="build-email">Email *</Label>
                              <Input 
                                id="build-email" 
                                type="email"
                                value={resumeData.email}
                                onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                                placeholder="john@example.com" 
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="build-phone">Phone</Label>
                              <Input 
                                id="build-phone"
                                value={resumeData.phone}
                                onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                                placeholder="+1 234 567 8900" 
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="build-location">Location</Label>
                            <Input 
                              id="build-location"
                              value={resumeData.location}
                              onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                              placeholder="City, State/Country" 
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="build-summary">Professional Summary</Label>
                            <Textarea 
                              id="build-summary"
                              value={resumeData.summary}
                              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                              placeholder="Brief description of your skills, experience, and career goals..."
                              rows={4}
                            />
                          </div>

                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <p className="text-sm font-semibold">Auto-populated from your profile:</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              {profileData?.education_level && <p>• Education: {profileData.education_level}</p>}
                              {profileData?.university && <p>• University: {profileData.university}</p>}
                              {profileData?.field_of_study && <p>• Field: {profileData.field_of_study}</p>}
                              {profileData?.skills?.length > 0 && <p>• Skills: {profileData.skills.join(", ")}</p>}
                              {profileData?.experience_level && <p>• Experience: {profileData.experience_level}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <PDFDownloadLink
                            document={<ProfessionalTemplate data={resumeData} />}
                            fileName={`${resumeData.full_name.replace(/\s+/g, '_')}_Resume.pdf`}
                            className="flex-1"
                          >
                            {({ loading }) => (
                              <Button className="w-full" disabled={loading || !resumeData.full_name || !resumeData.email}>
                                {loading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating PDF...
                                  </>
                                ) : (
                                  <>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Download Resume PDF
                                  </>
                                )}
                              </Button>
                            )}
                          </PDFDownloadLink>
                        </div>
                      </div>
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
              {existingResumeUrl && (
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
