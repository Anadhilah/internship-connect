import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Briefcase, MapPin, Globe, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrganizationProfile {
  id: string;
  company_name: string;
  company_size: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  approval_status: string;
  created_at: string;
}

export default function AdminManageOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organization_profiles")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast.error(error.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.industry?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-secondary gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

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
                  <h1 className="text-2xl font-heading font-bold">Manage Organizations</h1>
                  <p className="text-sm text-muted-foreground">View and manage approved organizations</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
            </Card>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrganizations.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No organizations found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrganizations.map((org) => (
                    <Card key={org.id} className="border-2 hover:shadow-soft transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-heading font-semibold">{org.company_name}</h3>
                                {org.industry && <Badge variant="outline">{org.industry}</Badge>}
                                {getStatusBadge(org.approval_status)}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {org.description || "No description provided"}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {org.company_size && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {org.company_size}
                                  </span>
                                )}
                                {org.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {org.location}
                                  </span>
                                )}
                                {org.website && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-4 w-4" />
                                    {org.website}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Briefcase className="h-4 w-4 mr-2" />
                              View Internships
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
