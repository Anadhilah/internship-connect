import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Plus, X } from "lucide-react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const internshipSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  department: z.string().min(1, "Department is required"),
  location: z.string().trim().min(3, "Location is required").max(100),
  type: z.enum(["remote", "onsite", "hybrid"], { required_error: "Work type is required" }),
  duration: z.string().min(1, "Duration is required"),
  stipend: z.string().trim().min(1, "Stipend information is required").max(50),
  description: z.string().trim().min(50, "Description must be at least 50 characters").max(2000, "Description must be less than 2000 characters"),
  responsibilities: z.string().trim().min(30, "Responsibilities must be at least 30 characters").max(1500),
  requirements: z.string().trim().min(30, "Requirements must be at least 30 characters").max(1500),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  education: z.string().min(1, "Education requirement is required"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  startDate: z.string().min(1, "Start date is required"),
  positions: z.string().min(1, "Number of positions is required"),
});

const PostInternship = () => {
  const { toast: toastHook } = useToast();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };
  const [currentSkill, setCurrentSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    duration: "",
    stipend: "",
    description: "",
    responsibilities: "",
    requirements: "",
    education: "",
    applicationDeadline: "",
    startDate: "",
    positions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddSkill = () => {
    const trimmedSkill = currentSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      if (skills.length >= 10) {
        toastHook({
          title: "Maximum skills reached",
          description: "You can add up to 10 skills only",
          variant: "destructive",
        });
        return;
      }
      setSkills([...skills, trimmedSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = internshipSchema.parse({
        ...formData,
        skills,
      });

      console.log("Form submitted:", validatedData);
      
      toastHook({
        title: "Success!",
        description: "Internship position posted successfully",
      });

      // Reset form
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "",
        duration: "",
        stipend: "",
        description: "",
        responsibilities: "",
        requirements: "",
        education: "",
        applicationDeadline: "",
        startDate: "",
        positions: "",
      });
      setSkills([]);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toastHook({
          title: "Validation Error",
          description: "Please check all required fields",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <OrganizationSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-heading font-bold">Post Internship</h1>
                  <p className="text-sm text-muted-foreground">Create a new internship position</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            <form onSubmit={handleSubmit}>
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Basic Information */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Software Engineering Intern"
                          value={formData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          maxLength={100}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Input
                          id="department"
                          placeholder="e.g., Engineering, Marketing"
                          value={formData.department}
                          onChange={(e) => handleChange("department", e.target.value)}
                          maxLength={50}
                        />
                        {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., San Francisco, CA"
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          maxLength={100}
                        />
                        {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Work Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration *</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 3 months"
                          value={formData.duration}
                          onChange={(e) => handleChange("duration", e.target.value)}
                          maxLength={30}
                        />
                        {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stipend">Stipend *</Label>
                        <Input
                          id="stipend"
                          placeholder="e.g., $2000/month or Unpaid"
                          value={formData.stipend}
                          onChange={(e) => handleChange("stipend", e.target.value)}
                          maxLength={50}
                        />
                        {errors.stipend && <p className="text-sm text-destructive">{errors.stipend}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="positions">Positions *</Label>
                        <Input
                          id="positions"
                          type="number"
                          min="1"
                          placeholder="e.g., 2"
                          value={formData.positions}
                          onChange={(e) => handleChange("positions", e.target.value)}
                        />
                        {errors.positions && <p className="text-sm text-destructive">{errors.positions}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description of the internship position..."
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={6}
                        maxLength={2000}
                      />
                      <p className="text-xs text-muted-foreground">{formData.description.length}/2000 characters</p>
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsibilities">Key Responsibilities *</Label>
                      <Textarea
                        id="responsibilities"
                        placeholder="List the main responsibilities and duties..."
                        value={formData.responsibilities}
                        onChange={(e) => handleChange("responsibilities", e.target.value)}
                        rows={6}
                        maxLength={1500}
                      />
                      <p className="text-xs text-muted-foreground">{formData.responsibilities.length}/1500 characters</p>
                      {errors.responsibilities && <p className="text-sm text-destructive">{errors.responsibilities}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements *</Label>
                      <Textarea
                        id="requirements"
                        placeholder="List the qualifications and requirements..."
                        value={formData.requirements}
                        onChange={(e) => handleChange("requirements", e.target.value)}
                        rows={6}
                        maxLength={1500}
                      />
                      <p className="text-xs text-muted-foreground">{formData.requirements.length}/1500 characters</p>
                      {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills & Education */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Skills & Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Required Skills *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="Add a skill and press Enter"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          maxLength={50}
                        />
                        <Button type="button" onClick={handleAddSkill} size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill) => (
                          <div
                            key={skill}
                            className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level *</Label>
                      <Select value={formData.education} onValueChange={(value) => handleChange("education", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select minimum education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.education && <p className="text-sm text-destructive">{errors.education}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Dates & Application */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Dates & Application</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                        {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                        <Input
                          id="applicationDeadline"
                          type="date"
                          value={formData.applicationDeadline}
                          onChange={(e) => handleChange("applicationDeadline", e.target.value)}
                        />
                        {errors.applicationDeadline && <p className="text-sm text-destructive">{errors.applicationDeadline}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit" size="lg" className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Post Internship
                  </Button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PostInternship;
