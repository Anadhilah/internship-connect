import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, X, Check } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const internSchema = z.object({
  fullName: z.string().trim().min(1, { message: "Full name is required" }).max(200),
  educationLevel: z.string().min(1, { message: "Please select education level" }),
  fieldOfStudy: z.string().trim().min(1, { message: "Field of study is required" }).max(200),
  university: z.string().trim().min(1, { message: "University is required" }).max(200),
  experienceLevel: z.string().min(1, { message: "Please select experience level" }),
  availability: z.string().min(1, { message: "Please select availability" }),
  resumeUrl: z.string().trim().url({ message: "Invalid URL" }).or(z.literal("")),
  portfolioUrl: z.string().trim().url({ message: "Invalid URL" }).or(z.literal("")),
});

const STEPS = [
  { id: 1, name: "Basic Info", description: "Personal & Education" },
  { id: 2, name: "Experience", description: "Your Background" },
  { id: 3, name: "Skills & Interests", description: "What You Know" },
  { id: 4, name: "Additional Info", description: "Optional Details" },
];

export default function InternOnboarding() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");

  const form = useForm<z.infer<typeof internSchema>>({
    resolver: zodResolver(internSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      educationLevel: "",
      fieldOfStudy: "",
      university: "",
      experienceLevel: "",
      availability: "",
      resumeUrl: "",
      portfolioUrl: "",
    },
  });

  const formData = form.watch();

  const progress = useMemo(() => {
    const requiredFields = [
      formData.fullName,
      formData.educationLevel,
      formData.fieldOfStudy,
      formData.university,
      formData.experienceLevel,
      formData.availability,
    ];
    const filledFields = requiredFields.filter(field => field.trim() !== "").length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData]);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()]);
      setCurrentInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof internSchema>)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "educationLevel", "fieldOfStudy", "university"];
        break;
      case 2:
        fieldsToValidate = ["experienceLevel", "availability"];
        break;
      case 4:
        fieldsToValidate = ["resumeUrl", "portfolioUrl"];
        break;
    }

    if (fieldsToValidate.length === 0) return true;
    
    const result = await form.trigger(fieldsToValidate);
    if (!result) {
      toast.error("Please fix the errors before proceeding");
    }
    return result;
  };

  const handleNext = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!(await validateCurrentStep())) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('intern_profiles')
        .insert({
          user_id: user.id,
          full_name: data.fullName,
          education_level: data.educationLevel,
          field_of_study: data.fieldOfStudy,
          university: data.university,
          skills: skills,
          experience_level: data.experienceLevel,
          interests: interests,
          availability: data.availability,
          resume_url: data.resumeUrl || null,
          portfolio_url: data.portfolioUrl || null,
        });

      if (error) {
        toast.error('Failed to create profile');
        console.error(error);
        return;
      }

      toast.success('Profile created successfully!');
      navigate('/applicant/dashboard');
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  });

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading font-bold">
              Welcome to Your Internship Journey! 🎓
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your profile to connect you with amazing opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Build Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your education, skills, and experience to help organizations find you
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Matched</h3>
                  <p className="text-sm text-muted-foreground">
                    Our platform will connect you with internships that match your interests
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Apply & Track</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply to positions and track your application status in real-time
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">What you'll need:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Educational background and university details</li>
                <li>• Your skills and areas of interest</li>
                <li>• Experience level and availability</li>
                <li>• Portfolio URL (optional)</li>
              </ul>
            </div>

            <Button onClick={() => setShowWelcome(false)} className="w-full" size="lg">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading font-bold">
            Complete Your Intern Profile
          </CardTitle>
          <CardDescription>
            Tell us about yourself to find the perfect internship
          </CardDescription>
          
          {/* Step Indicators */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                        currentStep > step.id
                          ? "bg-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 text-center hidden sm:block">
                      <div className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 mx-2 transition-colors",
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="High School">High School</SelectItem>
                              <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                              <SelectItem value="PhD">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fieldOfStudy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Computer Science" disabled={loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="No Experience">No Experience</SelectItem>
                              <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                              <SelectItem value="1-2 years">1-2 years</SelectItem>
                              <SelectItem value="2-3 years">2-3 years</SelectItem>
                              <SelectItem value="3+ years">3+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Immediate">Immediate</SelectItem>
                              <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                              <SelectItem value="Within 2 months">Within 2 months</SelectItem>
                              <SelectItem value="Within 3 months">Within 3 months</SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Interests */}
              {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill"
                      disabled={loading}
                    />
                    <Button type="button" onClick={addSkill} disabled={loading}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <div className="flex gap-2">
                    <Input
                      id="interests"
                      value={currentInterest}
                      onChange={(e) => setCurrentInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      placeholder="Add an interest"
                      disabled={loading}
                    />
                    <Button type="button" onClick={addInterest} disabled={loading}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                </div>
              )}

              {/* Step 4: Additional Info */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://example.com/resume.pdf" disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://yourportfolio.com" disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                  className="w-full"
                >
                  Previous
                </Button>
                
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full"
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Profile
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
