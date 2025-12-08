import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  CheckCircle, 
  Trash2, 
  Briefcase, 
  MapPin, 
  Building2,
  Calendar,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Internship {
  id: string;
  title: string;
  department: string;
  location: string;
  work_type: string;
  status: string;
  created_at: string;
  organization_id: string;
  description: string;
}

export default function AdminContentModeration() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"view" | "remove" | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleAction = (internship: Internship, action: "view" | "remove") => {
    setSelectedInternship(internship);
    setDialogAction(action);
    setShowDialog(true);
  };

  const confirmRemove = async () => {
    if (!selectedInternship) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("internships")
        .delete()
        .eq("id", selectedInternship.id);

      if (error) throw error;

      toast.success("Internship removed successfully");
      setShowDialog(false);
      setSelectedInternship(null);
      fetchInternships();
    } catch (error: any) {
      console.error("Error removing internship:", error);
      toast.error(error.message || "Failed to remove internship");
    } finally {
      setProcessing(false);
    }
  };

  const toggleInternshipStatus = async (internship: Internship) => {
    const newStatus = internship.status === "active" ? "inactive" : "active";
    try {
      const { error } = await supabase
        .from("internships")
        .update({ status: newStatus })
        .eq("id", internship.id);

      if (error) throw error;

      toast.success(`Internship ${newStatus === "active" ? "activated" : "deactivated"}`);
      fetchInternships();
    } catch (error: any) {
      console.error("Error updating internship:", error);
      toast.error(error.message || "Failed to update internship");
    }
  };

  const activeInternships = internships.filter(i => i.status === "active");
  const inactiveInternships = internships.filter(i => i.status !== "active");

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
                  <h1 className="text-2xl font-heading font-bold">Content Moderation</h1>
                  <p className="text-sm text-muted-foreground">Manage internship listings</p>
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
              <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="active" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Active Listings ({activeInternships.length})
                  </TabsTrigger>
                  <TabsTrigger value="inactive" className="gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Inactive Listings ({inactiveInternships.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeInternships.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No active internship listings</p>
                      </CardContent>
                    </Card>
                  ) : (
                    activeInternships.map((internship) => (
                      <Card key={internship.id} className="border-2 hover:shadow-soft transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-heading font-semibold text-lg">{internship.title}</h4>
                                <Badge variant="default" className="bg-secondary">Active</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {internship.department}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {internship.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(internship.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{internship.description}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline" onClick={() => handleAction(internship, "view")}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toggleInternshipStatus(internship)}>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction(internship, "remove")}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="inactive" className="space-y-4">
                  {inactiveInternships.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No inactive listings</p>
                      </CardContent>
                    </Card>
                  ) : (
                    inactiveInternships.map((internship) => (
                      <Card key={internship.id} className="border-2 border-muted hover:shadow-soft transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-heading font-semibold text-lg">{internship.title}</h4>
                                <Badge variant="secondary">Inactive</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {internship.department}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {internship.location}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{internship.description}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline" onClick={() => toggleInternshipStatus(internship)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction(internship, "remove")}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "view" ? "Internship Details" : "Remove Internship"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "view" 
                ? "View the full details of this internship listing"
                : "Are you sure you want to permanently remove this internship? This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>

          {dialogAction === "view" && selectedInternship && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-1">Title</h4>
                <p className="text-muted-foreground">{selectedInternship.title}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Department</h4>
                <p className="text-muted-foreground">{selectedInternship.department}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-muted-foreground">{selectedInternship.location}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Work Type</h4>
                <p className="text-muted-foreground">{selectedInternship.work_type}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground">{selectedInternship.description}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={processing}>
              {dialogAction === "view" ? "Close" : "Cancel"}
            </Button>
            {dialogAction === "remove" && (
              <Button variant="destructive" onClick={confirmRemove} disabled={processing}>
                {processing ? "Removing..." : "Remove Internship"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
