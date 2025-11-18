import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Briefcase, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
  // Mock data
  const stats = [
    { label: "Total Organizations", value: "156", icon: Building2, color: "text-primary" },
    { label: "Total Applicants", value: "1,234", icon: Users, color: "text-secondary" },
    { label: "Active Internships", value: "342", icon: Briefcase, color: "text-accent-foreground" },
    { label: "Pending Approvals", value: "8", icon: Clock, color: "text-destructive" },
  ];

  const pendingOrganizations = [
    { name: "Tech Innovations Inc", email: "contact@techinnovations.com", date: "2024-01-15", industry: "Technology" },
    { name: "Design Masters Studio", email: "hr@designmasters.com", date: "2024-01-15", industry: "Design" },
    { name: "Marketing Pros", email: "info@marketingpros.com", date: "2024-01-14", industry: "Marketing" },
    { name: "Finance Corp", email: "careers@financecorp.com", date: "2024-01-14", industry: "Finance" },
  ];

  const recentActivity = [
    { type: "approval", message: "Approved Tech Corp Inc", time: "2 hours ago" },
    { type: "removal", message: "Removed inappropriate listing from XYZ Company", time: "5 hours ago" },
    { type: "approval", message: "Approved Design Studio Ltd", time: "1 day ago" },
    { type: "alert", message: "Flagged listing for review", time: "1 day ago" },
  ];

  const platformStats = [
    { label: "Applications This Month", value: "2,456", change: "+12%" },
    { label: "New Users This Week", value: "234", change: "+8%" },
    { label: "Active Chats", value: "567", change: "+15%" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Platform Overview & Management</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Logout</Button>
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
              {/* Platform Stats */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformStats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-heading font-bold">{stat.value}</p>
                      </div>
                      <Badge variant="secondary" className="text-secondary border-secondary">
                        {stat.change}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Recent Activity
                    </span>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === 'approval' ? 'bg-secondary/20 text-secondary' :
                          activity.type === 'removal' ? 'bg-destructive/20 text-destructive' :
                          'bg-accent text-accent-foreground'
                        }`}>
                          {activity.type === 'approval' ? <CheckCircle className="h-4 w-4" /> :
                           activity.type === 'removal' ? <XCircle className="h-4 w-4" /> :
                           <AlertCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Organization Approvals */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Pending Organization Approvals
                  </span>
                  <Badge variant="destructive">{pendingOrganizations.length} pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingOrganizations.map((org, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                          {org.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{org.name}</h4>
                          <p className="text-sm text-muted-foreground">{org.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{org.industry}</Badge>
                            <span className="text-xs text-muted-foreground">Applied {org.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-secondary hover:bg-secondary-hover text-white">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Banner */}
            <Card className="mt-6 border-2 border-destructive/50 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">Action Required</h3>
                    <p className="text-sm text-muted-foreground">You have {pendingOrganizations.length} organizations waiting for approval. Review them to keep the platform active.</p>
                  </div>
                  <Button variant="destructive" className="ml-auto">
                    Review Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
