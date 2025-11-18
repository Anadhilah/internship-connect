import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle, 
  Users,
  Shield,
  Zap
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                InternConnect
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">Admin</Link>
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              Find Your Perfect <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Internship Match
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with verified organizations, auto-generate your resume, and track your applications all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-white shadow-hover transition-all" asChild>
                <Link to="/applicant/dashboard">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Find Internships
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-accent" asChild>
                <Link to="/organization/dashboard">
                  <Users className="mr-2 h-5 w-5" />
                  Post Opportunities
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span>Verified Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span>Auto Resume Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span>Real-time Chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your internship search and hiring process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Smart Resume Builder</h3>
                <p className="text-muted-foreground">
                  Upload your resume or auto-generate one from your profile. Get AI-powered improvement suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Verified Organizations</h3>
                <p className="text-muted-foreground">
                  All companies are verified by our admin team to ensure legitimacy and quality opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Real-time Chat</h3>
                <p className="text-muted-foreground">
                  Connect directly with recruiters through our built-in chat system for interviews and questions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Application Tracking</h3>
                <p className="text-muted-foreground">
                  Track your application status in real-time with our comprehensive ATS-style workflow system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Quick Applications</h3>
                <p className="text-muted-foreground">
                  Apply to multiple internships with one click. Your resume is automatically sent with each application.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">For Organizations</h3>
                <p className="text-muted-foreground">
                  Post opportunities, filter applicants, manage hiring workflows, and connect with top talent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and find your dream internship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and complete your profile. Upload or auto-generate your resume in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Browse & Apply</h3>
              <p className="text-muted-foreground">
                Search verified internship opportunities and apply with one click. Your resume goes automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Connect & Track</h3>
              <p className="text-muted-foreground">
                Chat with recruiters, attend interviews, and track all your applications in one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="border-2 bg-gradient-hero shadow-hover">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students and organizations already connected on InternConnect
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white" asChild>
                  <Link to="/applicant/dashboard">Get Started as Student</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2" asChild>
                  <Link to="/organization/dashboard">Register as Organization</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-heading font-bold">InternConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InternConnect. Connecting talent with opportunity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
