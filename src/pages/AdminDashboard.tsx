import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Briefcase, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrganizationProfile {
  id: string;
  company_name: string;
  industry: string | null;
  created_at: string;
  approval_status: string;
}

interface Stats {
  totalOrganizations: number;
  totalInterns: number;
  activeInternships: number;
  pendingApprovals: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalOrganizations: 0,
    totalInterns: 0,
    activeInternships: 0,
    pendingApprovals: 0,
  });
  const [pendingOrganizations, setPendingOrganizations] = useState<OrganizationProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [orgsResult, internsResult, internshipsResult, pendingResult] = await Promise.all([
        supabase.from("organization_profiles").select("id", { count: "exact", head: true }),
        supabase.from("intern_profiles").select("id", { count: "exact", head: true }),
        supabase.from("internships").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("organization_profiles").select("*").eq("approval_status", "pending").order("created_at", { ascending: false }).limit(4),
      ]);

      setStats({
        totalOrganizations: orgsResult.count || 0,
        totalInterns: internsResult.count || 0,
        activeInternships: internshipsResult.count || 0,
        pendingApprovals: pendingResult.data?.length || 0,
      });

      setPendingOrganizations(pendingResult.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleApprove = async (orgId: string) => {
    try {
      const { error } = await supabase.rpc("update_organization_approval", {
        _org_id: orgId,
        _status: "approved",
      });

      if (error) throw error;

      toast.success("Organization approved!");
      fetchDashboardData();
    } catch (error: any) {
      console.error("Error approving organization:", error);
      toast.error(error.message || "Failed to approve organization");
    }
  };

  const handleReject = async (orgId: string) => {
    try {
      const { error } = await supabase.rpc("update_organization_approval", {
        _org_id: orgId,
        _status: "rejected",
        _reason: "Rejected by admin",
      });

      if (error) throw error;

      toast.success("Organization rejected");
      fetchDashboardData();
    } catch (error: any) {
      console.error("Error rejecting organization:", error);
      toast.error(error.message || "Failed to reject organization");
    }
  };

  const statsCards = [
    { label: "Total Organizations", value: stats.totalOrganizations.toString(), icon: Building2, color: "text-primary" },
    { label: "Total Applicants", value: stats.totalInterns.toString(), icon: Users, color: "text-secondary" },
    { label: "Active Internships", value: stats.activeInternships.toString(), icon: Briefcase, color: "text-accent-foreground" },
    { label: "Pending Approvals", value: stats.pendingApprovals.toString(), icon: Clock, color: "text-destructive" },
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
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {statsCards.map((stat) => (
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
                    {pendingOrganizations.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                        <p className="text-muted-foreground">No pending approvals</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingOrganizations.map((org) => (
                          <div key={org.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                {org.company_name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{org.company_name}</h4>
                                <div className="flex gap-2 mt-1">
                                  {org.industry && <Badge variant="outline">{org.industry}</Badge>}
                                  <span className="text-xs text-muted-foreground">
                                    Applied {new Date(org.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate("/admin/approvals")}
                              >
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-secondary hover:bg-secondary/90"
                                onClick={() => handleApprove(org.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleReject(org.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Alert Banner */}
                {pendingOrganizations.length > 0 && (
                  <Card className="mt-6 border-2 border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <div>
                          <h3 className="text-lg font-heading font-semibold mb-1">Action Required</h3>
                          <p className="text-sm text-muted-foreground">You have {pendingOrganizations.length} organizations waiting for approval. Review them to keep the platform active.</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          className="ml-auto"
                          onClick={() => navigate("/admin/approvals")}
                        >
                          Review Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
