import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Building2, 
  Calendar, 
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  status: string;
  applied_at: string;
  internships: {
    title: string;
    location: string;
    organization_profiles: {
      company_name: string;
    };
  };
}

const ApplicationTracking = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships!inner(
            title,
            location,
            organization_id,
            organization_profiles!internships_organization_id_fkey(company_name)
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, any> = {
      submitted: { label: "Submitted", variant: "secondary", icon: Send, color: "text-blue-500" },
      under_review: { label: "Under Review", variant: "default", icon: Eye, color: "text-yellow-500" },
      interview_scheduled: { label: "Interview", variant: "default", icon: AlertCircle, color: "text-purple-500" },
      interviewed: { label: "Interviewed", variant: "default", icon: AlertCircle, color: "text-purple-500" },
      rejected: { label: "Rejected", variant: "destructive", icon: XCircle, color: "text-destructive" },
      accepted: { label: "Accepted", variant: "default", icon: CheckCircle2, color: "text-green-500" },
      withdrawn: { label: "Withdrawn", variant: "secondary", icon: XCircle, color: "text-gray-500" },
    };
    return statusMap[status] || statusMap.submitted;
  };
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.internships.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.internships.organization_profiles.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    interview_scheduled: applications.filter((a) => a.status === "interview_scheduled" || a.status === "interviewed").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <ApplicantSidebar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ApplicantSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Application Tracking</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor your internship applications and their progress
              </p>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by company or position..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Tabs */}
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">
                    All ({statusCounts.all})
                  </TabsTrigger>
                  <TabsTrigger value="submitted">
                    Submitted ({statusCounts.submitted})
                  </TabsTrigger>
                  <TabsTrigger value="under_review">
                    Review ({statusCounts.under_review})
                  </TabsTrigger>
                  <TabsTrigger value="interview_scheduled">
                    Interview ({statusCounts.interview_scheduled})
                  </TabsTrigger>
                  <TabsTrigger value="accepted">
                    Accepted ({statusCounts.accepted})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({statusCounts.rejected})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="space-y-4 mt-6">
                  {filteredApplications.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No applications found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredApplications.map((application) => {
                      const statusInfo = getStatusInfo(application.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <Card key={application.id} className="overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-xl">{application.internships.title}</CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {application.internships.organization_profiles.company_name}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {application.internships.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {new Date(application.applied_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Badge variant={statusInfo.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ApplicationTracking;
