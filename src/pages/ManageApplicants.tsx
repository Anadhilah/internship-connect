import { useState } from "react";
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
import { Search, Filter, Eye, Mail, Phone, Calendar, GraduationCap, MapPin } from "lucide-react";
import { toast } from "sonner";

type ApplicationStatus = "applied" | "under_review" | "interview" | "rejected" | "accepted";

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  internshipTitle: string;
  appliedDate: string;
  status: ApplicationStatus;
  education: string;
  location: string;
  experience: string;
  matchScore: number;
}

const mockApplications: Application[] = [
  {
    id: "1",
    applicantName: "Sarah Johnson",
    applicantEmail: "sarah.j@email.com",
    applicantPhone: "+1 234-567-8901",
    internshipTitle: "Software Engineering Intern",
    appliedDate: "2024-01-15",
    status: "applied",
    education: "Computer Science, MIT",
    location: "Boston, MA",
    experience: "2 years",
    matchScore: 92,
  },
  {
    id: "2",
    applicantName: "Michael Chen",
    applicantEmail: "m.chen@email.com",
    applicantPhone: "+1 234-567-8902",
    internshipTitle: "Software Engineering Intern",
    appliedDate: "2024-01-14",
    status: "under_review",
    education: "Software Engineering, Stanford",
    location: "San Francisco, CA",
    experience: "1 year",
    matchScore: 88,
  },
  {
    id: "3",
    applicantName: "Emily Rodriguez",
    applicantEmail: "emily.r@email.com",
    applicantPhone: "+1 234-567-8903",
    internshipTitle: "UI/UX Design Intern",
    appliedDate: "2024-01-13",
    status: "interview",
    education: "Design, Parsons",
    location: "New York, NY",
    experience: "3 years",
    matchScore: 95,
  },
  {
    id: "4",
    applicantName: "James Wilson",
    applicantEmail: "j.wilson@email.com",
    applicantPhone: "+1 234-567-8904",
    internshipTitle: "Marketing Intern",
    appliedDate: "2024-01-12",
    status: "rejected",
    education: "Marketing, UCLA",
    location: "Los Angeles, CA",
    experience: "6 months",
    matchScore: 65,
  },
  {
    id: "5",
    applicantName: "Olivia Brown",
    applicantEmail: "olivia.b@email.com",
    applicantPhone: "+1 234-567-8905",
    internshipTitle: "Data Science Intern",
    appliedDate: "2024-01-11",
    status: "accepted",
    education: "Data Science, Carnegie Mellon",
    location: "Pittsburgh, PA",
    experience: "2 years",
    matchScore: 97,
  },
];

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applied: { label: "Applied", variant: "secondary" },
  under_review: { label: "Under Review", variant: "default" },
  interview: { label: "Interview", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
  accepted: { label: "Accepted", variant: "default" },
};

export default function ManageApplicants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternship, setSelectedInternship] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("applied");

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInternship = selectedInternship === "all" || app.internshipTitle === selectedInternship;

    const matchesTab = activeTab === "all" || app.status === activeTab;

    return matchesSearch && matchesInternship && matchesTab;
  });

  const handleStatusUpdate = () => {
    toast.success(`Application status updated to ${statusConfig[newStatus].label}`);
    setIsStatusDialogOpen(false);
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return mockApplications.length;
    return mockApplications.filter((app) => app.status === status).length;
  };

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
                <CardHeader className="pb-2">
                  <CardDescription>Total Applications</CardDescription>
                  <CardTitle className="text-3xl">{mockApplications.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Under Review</CardDescription>
                  <CardTitle className="text-3xl">{getStatusCount("under_review")}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Interviews</CardDescription>
                  <CardTitle className="text-3xl">{getStatusCount("interview")}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
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
                        <SelectItem value="Software Engineering Intern">Software Engineering</SelectItem>
                        <SelectItem value="UI/UX Design Intern">UI/UX Design</SelectItem>
                        <SelectItem value="Marketing Intern">Marketing</SelectItem>
                        <SelectItem value="Data Science Intern">Data Science</SelectItem>
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
                    <TabsTrigger value="applied">
                      Applied ({getStatusCount("applied")})
                    </TabsTrigger>
                    <TabsTrigger value="under_review">
                      Review ({getStatusCount("under_review")})
                    </TabsTrigger>
                    <TabsTrigger value="interview">
                      Interview ({getStatusCount("interview")})
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
                            <TableHead>Match</TableHead>
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
                                    <div className="font-medium">{application.applicantName}</div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {application.applicantEmail}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {application.education}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{application.internshipTitle}</div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {application.location}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    {new Date(application.appliedDate).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary"
                                        style={{ width: `${application.matchScore}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">{application.matchScore}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig[application.status].variant}>
                                    {statusConfig[application.status].label}
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
              Change the status for {selectedApplication?.applicantName}'s application
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
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
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
