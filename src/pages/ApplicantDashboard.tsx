import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApplicantDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  // Mock data - will be replaced with real data
  const stats = [
    { label: "Applications Sent", value: "12", icon: Briefcase, color: "text-primary" },
    { label: "In Progress", value: "5", icon: Clock, color: "text-secondary" },
    { label: "Interviews", value: "3", icon: MessageSquare, color: "text-accent-foreground" },
    { label: "Offers", value: "1", icon: CheckCircle, color: "text-secondary" },
  ];

  const recentApplications = [
    { company: "Tech Corp", position: "Software Engineering Intern", status: "Interview Scheduled", date: "2024-01-15" },
    { company: "Design Studio", position: "UI/UX Design Intern", status: "Under Review", date: "2024-01-14" },
    { company: "Marketing Inc", position: "Digital Marketing Intern", status: "Application Sent", date: "2024-01-13" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ApplicantSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, Student!</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-2 hover:shadow-soft transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-heading font-bold">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-lg bg-accent flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate("/applicant/dashboard")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Internships
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate("/applicant/resume")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Update Resume
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate("/applicant/messages")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Check Messages
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Recent Applications
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/applicant/applications")}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-semibold">{app.position}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                        </div>
                        <Badge variant={app.status === "Interview Scheduled" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Completion */}
            <Card className="mt-6 border-2 bg-gradient-hero">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">Add more details to increase your chances of getting hired</p>
                  </div>
                  <Button onClick={() => toast.info("Profile editing coming soon!")}>Complete Profile</Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ApplicantDashboard;
