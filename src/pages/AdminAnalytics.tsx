import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Building2, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalInterns: number;
  totalOrganizations: number;
  approvedOrganizations: number;
  pendingOrganizations: number;
  rejectedOrganizations: number;
  activeInternships: number;
  totalApplications: number;
}

interface IndustryData {
  industry: string;
  count: number;
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalInterns: 0,
    totalOrganizations: 0,
    approvedOrganizations: 0,
    pendingOrganizations: 0,
    rejectedOrganizations: 0,
    activeInternships: 0,
    totalApplications: 0,
  });
  const [industryData, setIndustryData] = useState<IndustryData[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        internsResult,
        orgsResult,
        approvedResult,
        pendingResult,
        rejectedResult,
        internshipsResult,
        applicationsResult,
        industryResult,
      ] = await Promise.all([
        supabase.from("intern_profiles").select("id", { count: "exact", head: true }),
        supabase.from("organization_profiles").select("id", { count: "exact", head: true }),
        supabase.from("organization_profiles").select("id", { count: "exact", head: true }).eq("approval_status", "approved"),
        supabase.from("organization_profiles").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase.from("organization_profiles").select("id", { count: "exact", head: true }).eq("approval_status", "rejected"),
        supabase.from("internships").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase.from("organization_profiles").select("industry").eq("approval_status", "approved"),
      ]);

      setStats({
        totalInterns: internsResult.count || 0,
        totalOrganizations: orgsResult.count || 0,
        approvedOrganizations: approvedResult.count || 0,
        pendingOrganizations: pendingResult.count || 0,
        rejectedOrganizations: rejectedResult.count || 0,
        activeInternships: internshipsResult.count || 0,
        totalApplications: applicationsResult.count || 0,
      });

      // Process industry data
      if (industryResult.data) {
        const industryCounts: Record<string, number> = {};
        industryResult.data.forEach((org) => {
          const industry = org.industry || "Other";
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });
        
        const sortedIndustries = Object.entries(industryCounts)
          .map(([industry, count]) => ({ industry, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        
        setIndustryData(sortedIndustries);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const approvalData = [
    { name: "Approved", value: stats.approvedOrganizations, color: "hsl(var(--secondary))" },
    { name: "Pending", value: stats.pendingOrganizations, color: "hsl(var(--primary))" },
    { name: "Rejected", value: stats.rejectedOrganizations, color: "hsl(var(--destructive))" },
  ].filter(d => d.value > 0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-heading font-bold">Analytics Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Platform insights and statistics</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <Card className="border-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                      <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading font-bold">{stats.totalInterns}</div>
                      <p className="text-xs text-muted-foreground">Registered interns</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                      <Building2 className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading font-bold">{stats.totalOrganizations}</div>
                      <p className="text-xs text-muted-foreground">{stats.approvedOrganizations} approved</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                      <Briefcase className="h-4 w-4 text-accent-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading font-bold">{stats.activeInternships}</div>
                      <p className="text-xs text-muted-foreground">Currently posted</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Applications</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading font-bold">{stats.totalApplications}</div>
                      <p className="text-xs text-muted-foreground">Total submitted</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Approval Status Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card className="border-2 border-secondary/30">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-heading font-bold">{stats.approvedOrganizations}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/30">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-heading font-bold">{stats.pendingOrganizations}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-destructive/30">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-2xl font-heading font-bold">{stats.rejectedOrganizations}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <Tabs defaultValue="industries" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="industries">Industries</TabsTrigger>
                    <TabsTrigger value="approval">Approval Status</TabsTrigger>
                  </TabsList>

                  <TabsContent value="industries">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>Organizations by Industry</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {industryData.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            No industry data available
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={industryData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="industry" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="approval">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>Organization Approval Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {approvalData.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            No approval data available
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={approvalData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, value }) => `${name}: ${value}`}
                                >
                                  {approvalData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
