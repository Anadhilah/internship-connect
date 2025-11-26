import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminContentModeration() {
  const navigate = useNavigate();
  const [flaggedContent] = useState<any[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-heading font-bold">Content Moderation</h1>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>

            <Tabs defaultValue="listings" className="space-y-4">
              <TabsList>
                <TabsTrigger value="listings">Flagged Listings</TabsTrigger>
                <TabsTrigger value="profiles">Reported Profiles</TabsTrigger>
                <TabsTrigger value="messages">Flagged Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Flagged Internship Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {flaggedContent.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No flagged listings to review</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {flaggedContent.map((item) => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <Badge variant="destructive">Flagged</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                                  <p className="text-xs text-muted-foreground">Reported by: {item.reporter}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profiles">
                <Card>
                  <CardHeader>
                    <CardTitle>Reported Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reported profiles to review</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Flagged Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No flagged messages to review</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
