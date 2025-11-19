import { useState } from "react";
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
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  status: "applied" | "under-review" | "interview" | "rejected" | "accepted";
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
  salary?: string;
}

const ApplicationTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock applications data
  const applications: Application[] = [
    {
      id: "1",
      company: "TechCorp Solutions",
      position: "Frontend Developer Intern",
      location: "San Francisco, CA",
      appliedDate: "2024-01-15",
      status: "interview",
      salary: "$25/hour",
      timeline: [
        { status: "Applied", date: "2024-01-15", description: "Application submitted successfully" },
        { status: "Under Review", date: "2024-01-18", description: "Resume being reviewed by hiring team" },
        { status: "Interview Scheduled", date: "2024-01-22", description: "Technical interview on Jan 28, 2024 at 2:00 PM" },
      ],
    },
    {
      id: "2",
      company: "StartupHub Inc",
      position: "Full Stack Developer Intern",
      location: "Remote",
      appliedDate: "2024-01-14",
      status: "under-review",
      salary: "$20-30/hour",
      timeline: [
        { status: "Applied", date: "2024-01-14", description: "Application submitted successfully" },
        { status: "Under Review", date: "2024-01-16", description: "Your application is being reviewed" },
      ],
    },
    {
      id: "3",
      company: "Digital Agency Co",
      position: "UI/UX Design Intern",
      location: "New York, NY",
      appliedDate: "2024-01-13",
      status: "accepted",
      salary: "$22/hour",
      timeline: [
        { status: "Applied", date: "2024-01-13", description: "Application submitted successfully" },
        { status: "Under Review", date: "2024-01-15", description: "Resume reviewed" },
        { status: "Interview", date: "2024-01-18", description: "Completed initial interview" },
        { status: "Accepted", date: "2024-01-20", description: "Congratulations! Offer letter sent" },
      ],
    },
    {
      id: "4",
      company: "Finance Solutions Ltd",
      position: "Data Analyst Intern",
      location: "Boston, MA",
      appliedDate: "2024-01-10",
      status: "rejected",
      salary: "$18/hour",
      timeline: [
        { status: "Applied", date: "2024-01-10", description: "Application submitted successfully" },
        { status: "Under Review", date: "2024-01-12", description: "Application reviewed" },
        { status: "Rejected", date: "2024-01-14", description: "Position filled by another candidate" },
      ],
    },
    {
      id: "5",
      company: "Marketing Pro Agency",
      position: "Digital Marketing Intern",
      location: "Los Angeles, CA",
      appliedDate: "2024-01-12",
      status: "applied",
      salary: "$15-20/hour",
      timeline: [
        { status: "Applied", date: "2024-01-12", description: "Application submitted successfully" },
      ],
    },
  ];

  const getStatusInfo = (status: Application["status"]) => {
    const statusMap = {
      applied: { label: "Applied", variant: "secondary" as const, icon: Send, color: "text-blue-500" },
      "under-review": { label: "Under Review", variant: "default" as const, icon: Eye, color: "text-yellow-500" },
      interview: { label: "Interview", variant: "default" as const, icon: AlertCircle, color: "text-purple-500" },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
      accepted: { label: "Accepted", variant: "default" as const, icon: CheckCircle2, color: "text-green-500" },
    };
    return statusMap[status];
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    "under-review": applications.filter((a) => a.status === "under-review").length,
    interview: applications.filter((a) => a.status === "interview").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

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
                  <TabsTrigger value="applied">
                    Applied ({statusCounts.applied})
                  </TabsTrigger>
                  <TabsTrigger value="under-review">
                    Review ({statusCounts["under-review"]})
                  </TabsTrigger>
                  <TabsTrigger value="interview">
                    Interview ({statusCounts.interview})
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
                                <CardTitle className="text-xl">{application.position}</CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {application.company}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {application.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {application.appliedDate}
                                  </div>
                                </div>
                                {application.salary && (
                                  <p className="text-sm font-medium text-primary">
                                    {application.salary}
                                  </p>
                                )}
                              </div>
                              <Badge variant={statusInfo.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent>
                            {/* Timeline */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Application Timeline
                              </h4>
                              <div className="relative pl-6 space-y-4">
                                {/* Timeline line */}
                                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

                                {application.timeline.map((event, index) => {
                                  const isLast = index === application.timeline.length - 1;
                                  return (
                                    <div key={index} className="relative">
                                      {/* Timeline dot */}
                                      <div
                                        className={cn(
                                          "absolute -left-[1.3rem] top-1 h-4 w-4 rounded-full border-2 bg-background",
                                          isLast ? "border-primary bg-primary" : "border-muted-foreground"
                                        )}
                                      />
                                      
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <p className={cn(
                                            "font-medium text-sm",
                                            isLast && "text-primary"
                                          )}>
                                            {event.status}
                                          </p>
                                          <span className="text-xs text-muted-foreground">
                                            {event.date}
                                          </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {event.description}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {application.status === "interview" && (
                                <Button size="sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  View Interview Details
                                </Button>
                              )}
                              {application.status === "accepted" && (
                                <Button size="sm">
                                  View Offer Letter
                                </Button>
                              )}
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
