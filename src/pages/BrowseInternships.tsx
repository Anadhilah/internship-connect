import { useState } from "react";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Building2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BrowseInternships() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const mockInternships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "Remote",
      industry: "Technology",
      description: "Work on cutting-edge web applications using React and Node.js. Great learning opportunity for aspiring developers.",
    },
    {
      id: 2,
      title: "Marketing Intern",
      company: "Brand Agency",
      location: "New York, NY",
      type: "Hybrid",
      industry: "Marketing",
      description: "Assist with social media campaigns and content creation. Perfect for creative minds passionate about digital marketing.",
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "Analytics Inc",
      location: "Austin, TX",
      type: "On-site",
      industry: "Data Science",
      description: "Work with large datasets and machine learning models. Gain hands-on experience with Python and data visualization tools.",
    },
  ];

  const handleApply = (internshipId: number) => {
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the organization.",
    });
  };

  const filteredInternships = mockInternships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                          <p className="text-sm text-muted-foreground">{internship.company}</p>
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
                        {internship.type}
                      </Badge>
                      <Badge>{internship.industry}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{internship.description}</p>
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
