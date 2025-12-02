import { useState } from "react";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newApplications: true,
    messages: true,
    weeklyDigest: false,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use the secure delete function to remove all user data
      const { error } = await supabase.rpc("delete_user_account");

      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <OrganizationSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-heading font-bold">Settings</h1>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Applications</p>
                    <p className="text-sm text-muted-foreground">Get notified of new applications</p>
                  </div>
                  <Switch
                    checked={notifications.newApplications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newApplications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">Get notified of new messages</p>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Weekly summary of activity</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyDigest: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </div>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
