import { useState, useEffect } from "react";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, Eye, Mail, Phone, Calendar, GraduationCap, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ApplicationStatus = "submitted" | "under_review" | "interview_scheduled" | "interviewed" | "rejected" | "accepted";

interface Application {
  id: string;
  applicant_id: string;
  internship_id: string;
  status: ApplicationStatus;
  applied_at: string;
  intern_profiles: {
    full_name: string;
    education_level: string | null;
    university: string | null;
  };
  internships: {
    title: string;
    location: string;
  };
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  submitted: { label: "Submitted", variant: "secondary" },
  under_review: { label: "Under Review", variant: "default" },
  interview_scheduled: { label: "Interview", variant: "outline" },
  interviewed: { label: "Interviewed", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
  accepted: { label: "Accepted", variant: "default" },
};

export default function ManageApplicants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternship, setSelectedInternship] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("submitted");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    fetchApplications();
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('internships')
        .select('id, title')
        .eq('organization_id', user.id);

      if (error) throw error;
      setInternships(data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          intern_profiles(full_name, education_level, university),
          internships!inner(title, location, organization_id)
        `)
        .eq('internships.organization_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.intern_profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.internships?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInternship = selectedInternship === "all" || app.internship_id === selectedInternship;

    const matchesTab = activeTab === "all" || app.status === activeTab;

    return matchesSearch && matchesInternship && matchesTab;
  });

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast.success(`Application status updated to ${statusConfig[newStatus].label}`);
      setIsStatusDialogOpen(false);
      fetchApplications(); // Refresh data
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <OrganizationSidebar />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <OrganizationSidebar />
        <main className="flex-1 bg-gradient-subtle">
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-heading font-bold">Manage Applicants</h1>
            </div>
          </header>

          <div className="container mx-auto p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardDescription>Total Applications</CardDescription>
                  <CardTitle className="text-3xl">{applications.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Under Review</CardDescription>
                  <CardTitle className="text-3xl">{getStatusCount("under_review")}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Interviews</CardDescription>
                  <CardTitle className="text-3xl">{getStatusCount("interview_scheduled") + getStatusCount("interviewed")}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Accepted</CardDescription>
                  <CardTitle className="text-3xl">{getStatusCount("accepted")}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or internship..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Select value={selectedInternship} onValueChange={setSelectedInternship}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by internship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Internships</SelectItem>
                        {internships.map((internship) => (
                          <SelectItem key={internship.id} value={internship.id}>
                            {internship.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Applications Table */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="all">
                      All ({getStatusCount("all")})
                    </TabsTrigger>
                    <TabsTrigger value="submitted">
                      Submitted ({getStatusCount("submitted")})
                    </TabsTrigger>
                    <TabsTrigger value="under_review">
                      Review ({getStatusCount("under_review")})
                    </TabsTrigger>
                    <TabsTrigger value="interview_scheduled">
                      Interview ({getStatusCount("interview_scheduled") + getStatusCount("interviewed")})
                    </TabsTrigger>
                    <TabsTrigger value="accepted">
                      Accepted ({getStatusCount("accepted")})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected ({getStatusCount("rejected")})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value={activeTab} className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Internship</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplications.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No applications found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredApplications.map((application) => (
                              <TableRow key={application.id}>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium">{application.intern_profiles?.full_name || 'Unknown'}</div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {application.intern_profiles?.education_level || 'Not specified'}
                                      </span>
                                    </div>
                                    {application.intern_profiles?.university && (
                                      <div className="text-sm text-muted-foreground">
                                        {application.intern_profiles.university}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{application.internships?.title}</div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {application.internships?.location}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    {new Date(application.applied_at).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig[application.status]?.variant || "secondary"}>
                                    {statusConfig[application.status]?.label || application.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setNewStatus(application.status);
                                        setIsStatusDialogOpen(true);
                                      }}
                                    >
                                      Update Status
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </main>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status for {selectedApplication?.intern_profiles?.full_name}'s application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ApplicationStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
