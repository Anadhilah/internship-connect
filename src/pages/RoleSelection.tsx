import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    checkExistingRole();
  }, []);

  const checkExistingRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleData?.role) {
        // User already has a role, check for profile
        if (roleData.role === 'organization') {
          const { data: profile } = await supabase
            .from('organization_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!profile) {
            navigate('/onboarding/organization');
          } else {
            navigate('/organization/dashboard');
          }
        } else if (roleData.role === 'intern') {
          const { data: profile } = await supabase
            .from('intern_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!profile) {
            navigate('/onboarding/intern');
          } else {
            navigate('/applicant/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Error checking role:', error);
    } finally {
      setCheckingRole(false);
    }
  };

  const selectRole = async (role: 'organization' | 'intern') => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: role,
        });

      if (error) {
        toast.error('Failed to set role');
        console.error(error);
        return;
      }

      toast.success(`Role set to ${role}`);
      
      if (role === 'organization') {
        navigate('/onboarding/organization');
      } else {
        navigate('/onboarding/intern');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select how you'd like to use InternConnect
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle>I'm an Organization</CardTitle>
              <CardDescription>
                Post internships and find talented candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => selectRole('organization')}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue as Organization
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle>I'm an Intern</CardTitle>
              <CardDescription>
                Find and apply for internship opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => selectRole('intern')}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue as Intern
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
