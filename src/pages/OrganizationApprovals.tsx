import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Users
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrganizationProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_size: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  created_at: string;
  approval_status: string;
  rejection_reason: string | null;
  approved_at: string | null;
}

const OrganizationApprovals = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<OrganizationProfile | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [pendingOrganizations, setPendingOrganizations] = useState<OrganizationProfile[]>([]);
  const [approvedOrganizations, setApprovedOrganizations] = useState<OrganizationProfile[]>([]);
  const [rejectedOrganizations, setRejectedOrganizations] = useState<OrganizationProfile[]>([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        supabase.from("organization_profiles").select("*").eq("approval_status", "pending").order("created_at", { ascending: false }),
        supabase.from("organization_profiles").select("*").eq("approval_status", "approved").order("approved_at", { ascending: false }).limit(20),
        supabase.from("organization_profiles").select("*").eq("approval_status", "rejected").order("updated_at", { ascending: false }).limit(20),
      ]);

      if (pendingResult.error) throw pendingResult.error;
      if (approvedResult.error) throw approvedResult.error;
      if (rejectedResult.error) throw rejectedResult.error;

      setPendingOrganizations(pendingResult.data || []);
      setApprovedOrganizations(approvedResult.data || []);
      setRejectedOrganizations(rejectedResult.data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleAction = (org: OrganizationProfile, action: "approve" | "reject") => {
    setSelectedOrg(org);
    setDialogAction(action);
    setRejectionReason("");
    setShowDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedOrg || !dialogAction) return;

    setProcessing(true);
    try {
      const { error } = await supabase.rpc("update_organization_approval", {
        _org_id: selectedOrg.id,
        _status: dialogAction === "approve" ? "approved" : "rejected",
        _reason: dialogAction === "reject" ? rejectionReason : null,
      });

      if (error) throw error;

      toast.success(
        dialogAction === "approve" 
          ? `${selectedOrg.company_name} has been approved!` 
          : `${selectedOrg.company_name} has been rejected`
      );
      
      setShowDialog(false);
      setSelectedOrg(null);
      setDialogAction(null);
      setRejectionReason("");
      fetchOrganizations();
    } catch (error: any) {
      console.error("Error updating organization:", error);
      toast.error(error.message || "Failed to update organization");
    } finally {
      setProcessing(false);
    }
  };

  const filteredPending = pendingOrganizations.filter(org =>
    org.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.industry?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
                    {filteredPending.length === 0 ? (
                      <Card className="border-2">
                        <CardContent className="p-12 text-center">
                          <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                          <p className="text-muted-foreground">No pending organizations to review</p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredPending.map((org) => (
                        <Card key={org.id} className="border-2 hover:shadow-soft transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl mb-1">{org.company_name}</CardTitle>
                                  {org.industry && <Badge variant="outline">{org.industry}</Badge>}
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
                                {org.website && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{org.website}</span>
                                  </div>
                                )}
                                {org.location && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{org.location}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-3">
                                {org.company_size && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Size: {org.company_size}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    Submitted: {new Date(org.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {org.description && (
                              <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">{org.description}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Approved Organizations */}
                  <TabsContent value="approved" className="space-y-4">
                    {approvedOrganizations.length === 0 ? (
                      <Card className="border-2">
                        <CardContent className="p-12 text-center">
                          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No approved organizations yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      approvedOrganizations.map((org) => (
                        <Card key={org.id} className="border-2 border-secondary/20">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                  <h3 className="font-heading font-semibold text-lg">{org.company_name}</h3>
                                  <p className="text-sm text-muted-foreground">{org.industry || "No industry specified"}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="default" className="gap-1 mb-2 bg-secondary">
                                  <CheckCircle className="h-3 w-3" />
                                  Approved
                                </Badge>
                                {org.approved_at && (
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(org.approved_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Rejected Organizations */}
                  <TabsContent value="rejected" className="space-y-4">
                    {rejectedOrganizations.length === 0 ? (
                      <Card className="border-2">
                        <CardContent className="p-12 text-center">
                          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No rejected organizations</p>
                        </CardContent>
                      </Card>
                    ) : (
                      rejectedOrganizations.map((org) => (
                        <Card key={org.id} className="border-2 border-destructive/20">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-destructive" />
                                </div>
                                <div>
                                  <h3 className="font-heading font-semibold text-lg">{org.company_name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">{org.industry || "No industry specified"}</p>
                                  {org.rejection_reason && (
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">Reason:</span> {org.rejection_reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="destructive" className="gap-1 mb-2">
                                  <XCircle className="h-3 w-3" />
                                  Rejected
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
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
                ? `Are you sure you want to approve ${selectedOrg?.company_name}? They will be able to post internship positions.`
                : `Are you sure you want to reject ${selectedOrg?.company_name}? Please provide a reason.`}
            </DialogDescription>
          </DialogHeader>
          
          {dialogAction === "reject" && (
            <div className="py-4">
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={processing || (dialogAction === "reject" && !rejectionReason.trim())}
            >
              {processing ? "Processing..." : dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default OrganizationApprovals;
