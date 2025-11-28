import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, MessageSquare, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    interview: 0,
    accepted: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch applications with internship details
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships(
            title,
            organization_profiles(company_name)
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      // Calculate stats
      const allApps = applications || [];
      setStats({
        total: allApps.length,
        submitted: allApps.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
        interview: allApps.filter(a => a.status === 'interview_scheduled' || a.status === 'interviewed').length,
        accepted: allApps.filter(a => a.status === 'accepted').length
      });

      setRecentApplications(allApps);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const statsDisplay = [
    { label: "Applications Sent", value: stats.total.toString(), icon: Briefcase, color: "text-primary" },
    { label: "In Progress", value: stats.submitted.toString(), icon: Clock, color: "text-secondary" },
    { label: "Interviews", value: stats.interview.toString(), icon: MessageSquare, color: "text-accent-foreground" },
    { label: "Offers", value: stats.accepted.toString(), icon: CheckCircle, color: "text-secondary" },
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
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {statsDisplay.map((stat) => (
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
                    {recentApplications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No applications yet</p>
                    ) : (
                      recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold">{app.internships?.title}</h4>
                            <p className="text-sm text-muted-foreground">{app.internships?.organization_profiles?.company_name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(app.applied_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={app.status === "interview_scheduled" ? "default" : "secondary"}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))
                    )}
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
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ApplicantDashboard;
