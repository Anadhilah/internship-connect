import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrganizationDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  // Mock data
  const stats = [
    { label: "Active Postings", value: "8", icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: "127", icon: Users, color: "text-secondary" },
    { label: "Under Review", value: "45", icon: Clock, color: "text-accent-foreground" },
    { label: "Hired", value: "12", icon: CheckCircle, color: "text-secondary" },
  ];

  const recentApplicants = [
    { name: "Alice Johnson", position: "Software Engineering Intern", status: "New", date: "2024-01-15", match: "95%" },
    { name: "Bob Smith", position: "Marketing Intern", status: "Reviewing", date: "2024-01-15", match: "88%" },
    { name: "Carol Williams", position: "Design Intern", status: "Interview", date: "2024-01-14", match: "92%" },
    { name: "David Brown", position: "Software Engineering Intern", status: "New", date: "2024-01-14", match: "85%" },
  ];

  const activePostings = [
    { title: "Software Engineering Intern", applicants: 45, views: 320, posted: "2024-01-10" },
    { title: "Marketing Intern", applicants: 32, views: 256, posted: "2024-01-12" },
    { title: "UI/UX Design Intern", applicants: 28, views: 198, posted: "2024-01-13" },
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
                    {activePostings.map((post, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{post.title}</h4>
                          <Badge variant="secondary">{post.applicants} applicants</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views} views
                          </span>
                          <span>Posted {post.posted}</span>
                        </div>
                      </div>
                    ))}
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
                  {recentApplicants.map((applicant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                          {applicant.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{applicant.name}</h4>
                          <p className="text-sm text-muted-foreground">{applicant.position}</p>
                        </div>
                        <Badge variant="outline" className="text-secondary border-secondary">
                          {applicant.match} match
                        </Badge>
                        <Badge variant={applicant.status === "New" ? "default" : "secondary"}>
                          {applicant.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationDashboard;
