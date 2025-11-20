import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Globe, 
  MapPin,
  Phone,
  Calendar,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrganizationApprovals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);

  // Mock data
  const pendingOrganizations = [
    {
      id: 1,
      name: "Tech Innovations Inc",
      email: "contact@techinnovations.com",
      phone: "+1 (555) 123-4567",
      website: "www.techinnovations.com",
      location: "San Francisco, CA",
      industry: "Technology",
      description: "Leading software development company specializing in AI and machine learning solutions for enterprise clients.",
      submittedDate: "2024-01-15",
      companySize: "50-200",
      foundedYear: "2018",
      documents: ["Business License", "Tax Certificate"]
    },
    {
      id: 2,
      name: "Design Masters Studio",
      email: "hr@designmasters.com",
      phone: "+1 (555) 234-5678",
      website: "www.designmasters.com",
      location: "New York, NY",
      industry: "Design",
      description: "Award-winning design agency creating exceptional digital experiences for global brands.",
      submittedDate: "2024-01-15",
      companySize: "10-50",
      foundedYear: "2020",
      documents: ["Business License", "Portfolio"]
    },
    {
      id: 3,
      name: "Marketing Pros Agency",
      email: "info@marketingpros.com",
      phone: "+1 (555) 345-6789",
      website: "www.marketingpros.com",
      location: "Los Angeles, CA",
      industry: "Marketing",
      description: "Full-service digital marketing agency helping businesses grow through strategic campaigns.",
      submittedDate: "2024-01-14",
      companySize: "20-50",
      foundedYear: "2019",
      documents: ["Business License"]
    },
    {
      id: 4,
      name: "Finance Corp Solutions",
      email: "careers@financecorp.com",
      phone: "+1 (555) 456-7890",
      website: "www.financecorp.com",
      location: "Chicago, IL",
      industry: "Finance",
      description: "Innovative fintech company providing financial solutions for small and medium-sized businesses.",
      submittedDate: "2024-01-14",
      companySize: "100-500",
      foundedYear: "2015",
      documents: ["Business License", "Financial Reports", "Tax Certificate"]
    }
  ];

  const approvedOrganizations = [
    {
      id: 5,
      name: "Tech Corp International",
      email: "hr@techcorp.com",
      industry: "Technology",
      approvedDate: "2024-01-10",
      approvedBy: "Admin User"
    },
    {
      id: 6,
      name: "Creative Studios Ltd",
      email: "contact@creativestudios.com",
      industry: "Design",
      approvedDate: "2024-01-09",
      approvedBy: "Admin User"
    }
  ];

  const rejectedOrganizations = [
    {
      id: 7,
      name: "Suspicious Company",
      email: "fake@company.com",
      industry: "Unknown",
      rejectedDate: "2024-01-08",
      rejectedBy: "Admin User",
      reason: "Incomplete documentation and suspicious business details"
    }
  ];

  const handleAction = (org: any, action: "approve" | "reject") => {
    setSelectedOrg(org);
    setDialogAction(action);
    setShowDialog(true);
  };

  const confirmAction = () => {
    // Handle approval/rejection logic here
    console.log(`${dialogAction} organization:`, selectedOrg);
    setShowDialog(false);
    setSelectedOrg(null);
    setDialogAction(null);
  };

  const filteredPending = pendingOrganizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <h1 className="text-2xl font-heading font-bold">Organization Approvals</h1>
                  <p className="text-sm text-muted-foreground">Review and manage organization registrations</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/20">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs for Different Statuses */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingOrganizations.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approved ({approvedOrganizations.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected ({rejectedOrganizations.length})
                </TabsTrigger>
              </TabsList>

              {/* Pending Organizations */}
              <TabsContent value="pending" className="space-y-4">
                {filteredPending.map((org) => (
                  <Card key={org.id} className="border-2 hover:shadow-soft transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-1">{org.name}</CardTitle>
                            <Badge variant="outline">{org.industry}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAction(org, "approve")}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(org, "reject")}
                            className="gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{org.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{org.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{org.website}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{org.location}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Founded: {org.foundedYear}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Size: {org.companySize} employees</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Submitted: {org.submittedDate}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {org.documents.map((doc, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">{org.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Approved Organizations */}
              <TabsContent value="approved" className="space-y-4">
                {approvedOrganizations.map((org) => (
                  <Card key={org.id} className="border-2 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-lg">{org.name}</h3>
                            <p className="text-sm text-muted-foreground">{org.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="gap-1 mb-2">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {org.approvedDate} by {org.approvedBy}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Rejected Organizations */}
              <TabsContent value="rejected" className="space-y-4">
                {rejectedOrganizations.map((org) => (
                  <Card key={org.id} className="border-2 border-destructive/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-lg">{org.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{org.email}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Reason:</span> {org.reason}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="gap-1 mb-2">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {org.rejectedDate} by {org.rejectedBy}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "Approve Organization" : "Reject Organization"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? `Are you sure you want to approve ${selectedOrg?.name}? They will be able to post internship positions.`
                : `Are you sure you want to reject ${selectedOrg?.name}? This action can be reviewed later.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default OrganizationApprovals;
