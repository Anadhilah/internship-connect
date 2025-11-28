import { useState, useEffect } from "react";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Building2, Bookmark, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BrowseInternships() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          organization_profiles!internships_organization_id_fkey(company_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleApply = async (internshipId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('internship_id', internshipId)
        .eq('applicant_id', user.id)
        .single();

      if (existing) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this internship.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          internship_id: internshipId,
          applicant_id: user.id,
          status: 'submitted'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the organization.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredInternships = internships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.organization_profiles?.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <ApplicantSidebar />
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
        <ApplicantSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-heading font-bold">Browse Internships</h1>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {filteredInternships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{internship.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{internship.organization_profiles?.company_name}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {internship.location}
                      </Badge>
                      <Badge variant="outline">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {internship.work_type}
                      </Badge>
                      <Badge>{internship.department}</Badge>
                      <Badge variant="outline">{internship.stipend}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{internship.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <p>Duration: {internship.duration}</p>
                      <p>Deadline: {new Date(internship.application_deadline).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleApply(internship.id)}>
                        Apply Now
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredInternships.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No internships found matching your search</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
