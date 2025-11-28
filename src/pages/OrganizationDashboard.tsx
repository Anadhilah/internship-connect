import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Eye, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplicants: 0,
    underReview: 0,
    hired: 0
  });
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [activePostings, setActivePostings] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch internships
      const { data: internships } = await supabase
        .from('internships')
        .select('*')
        .eq('organization_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Fetch applications
      const { data: applications } = await supabase
        .from('applications')
        .select(`
          *,
          internships!inner(organization_id),
          intern_profiles(full_name)
        `)
        .eq('internships.organization_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(4);

      const allApps = applications || [];
      setStats({
        activePostings: (internships || []).length,
        totalApplicants: allApps.length,
        underReview: allApps.filter(a => a.status === 'under_review' || a.status === 'submitted').length,
        hired: allApps.filter(a => a.status === 'accepted').length
      });

      setRecentApplicants(allApps);
      setActivePostings(internships || []);
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
    { label: "Active Postings", value: stats.activePostings.toString(), icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: stats.totalApplicants.toString(), icon: Users, color: "text-secondary" },
    { label: "Under Review", value: stats.underReview.toString(), icon: Clock, color: "text-accent-foreground" },
    { label: "Hired", value: stats.hired.toString(), icon: CheckCircle, color: "text-secondary" },
  ];

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
                  <h1 className="text-2xl font-heading font-bold">Organization Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Tech Corp Inc.</p>
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

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Quick Actions */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary-hover text-white"
                    onClick={() => navigate("/organization/post")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post New Internship
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate("/organization/applicants")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View All Applicants
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate("/organization/post")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Manage Postings
                  </Button>
                </CardContent>
              </Card>

              {/* Active Postings */}
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Active Postings
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/organization/post")}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activePostings.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No active postings</p>
                    ) : (
                      activePostings.slice(0, 3).map((post) => (
                        <div key={post.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{post.title}</h4>
                            <Badge variant="secondary">{post.positions_available} position(s)</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{post.location}</span>
                            <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applicants */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Recent Applicants
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/organization/applicants")}>View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplicants.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No applicants yet</p>
                  ) : (
                    recentApplicants.map((applicant) => (
                      <div key={applicant.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                            {applicant.intern_profiles?.full_name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{applicant.intern_profiles?.full_name || 'Unknown'}</h4>
                            <p className="text-sm text-muted-foreground">Applied {new Date(applicant.applied_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={applicant.status === "submitted" ? "default" : "secondary"}>
                            {applicant.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => navigate("/organization/applicants")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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

export default OrganizationDashboard;
