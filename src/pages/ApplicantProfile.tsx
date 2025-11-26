import { useState, useEffect } from "react";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Edit2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ApplicantProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    education_level: "",
    field_of_study: "",
    university: "",
    skills: [] as string[],
    experience_level: "",
    interests: [] as string[],
    availability: "",
    portfolio_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("intern_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
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

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("intern_profiles")
        .update(profile)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ApplicantSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-heading font-bold">My Profile</h1>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                <Button onClick={handleLogout} variant="outline">Logout</Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{profile.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.experience_level || "Experience level not set"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Education Level</label>
                    {isEditing ? (
                      <Input
                        value={profile.education_level}
                        onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.education_level || "Not specified"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Field of Study</label>
                    {isEditing ? (
                      <Input
                        value={profile.field_of_study}
                        onChange={(e) => setProfile({ ...profile, field_of_study: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.field_of_study || "Not specified"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">University</label>
                    {isEditing ? (
                      <Input
                        value={profile.university}
                        onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.university || "Not specified"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Availability</label>
                    {isEditing ? (
                      <Input
                        value={profile.availability}
                        onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.availability || "Not specified"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Portfolio URL</label>
                    {isEditing ? (
                      <Input
                        value={profile.portfolio_url}
                        onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{profile.portfolio_url || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills added</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.length > 0 ? (
                      profile.interests.map((interest, idx) => (
                        <Badge key={idx} variant="outline">{interest}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No interests added</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
