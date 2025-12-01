import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const organizationSchema = z.object({
  companyName: z.string().trim().min(1, { message: "Company name is required" }).max(200),
  companySize: z.string().min(1, { message: "Please select company size" }),
  industry: z.string().trim().min(1, { message: "Industry is required" }).max(100),
  location: z.string().trim().min(1, { message: "Location is required" }).max(200),
  description: z.string().trim().max(1000, { message: "Description must be less than 1000 characters" }),
  website: z.string().trim().url({ message: "Invalid website URL" }).or(z.literal("")),
});

const STEPS = [
  { id: 1, name: "Basic Info", description: "Company Details" },
  { id: 2, name: "Location & Industry", description: "Where You Operate" },
  { id: 3, name: "Additional Details", description: "More About You" },
];

export default function OrganizationOnboarding() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      companySize: "",
      industry: "",
      location: "",
      description: "",
      website: "",
    },
  });

  const formData = form.watch();

  const progress = useMemo(() => {
    const requiredFields = [
      formData.companyName,
      formData.companySize,
      formData.industry,
      formData.location,
    ];
    const filledFields = requiredFields.filter(field => field.trim() !== "").length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData]);

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof organizationSchema>)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["companyName", "companySize"];
        break;
      case 2:
        fieldsToValidate = ["industry", "location"];
        break;
      case 3:
        fieldsToValidate = ["website", "description"];
        break;
    }

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
        .from('organization_profiles')
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          company_size: data.companySize,
          industry: data.industry,
          location: data.location,
          description: data.description,
          website: data.website || null,
        });

      if (error) {
        toast.error('Failed to create profile');
        console.error(error);
        return;
      }

      toast.success('Profile created successfully!');
      navigate('/organization/dashboard');
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
              Welcome to Our Platform! 🚀
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your organization profile to start posting internships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">🏢</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Create Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Share details about your company to attract the best talent
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Verified</h3>
                  <p className="text-sm text-muted-foreground">
                    Your profile will be reviewed by our team to ensure quality
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">📢</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Post Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Once approved, start posting internships and connect with candidates
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">What you'll need:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Company name and size</li>
                <li>• Industry and location</li>
                <li>• Company description</li>
                <li>• Company website (optional)</li>
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
            Complete Your Organization Profile
          </CardTitle>
          <CardDescription>
            Tell us about your company to get started
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
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Location & Industry */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Technology, Finance" disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City, State/Country" disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://example.com" disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Tell us about your company..." rows={4} disabled={loading} />
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
