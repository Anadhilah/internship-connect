import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizationApprovals from "./pages/OrganizationApprovals";
import PostInternship from "./pages/PostInternship";
import ResumeManagement from "./pages/ResumeManagement";
import Messages from "./pages/Messages";
import ApplicationTracking from "./pages/ApplicationTracking";
import ManageApplicants from "./pages/ManageApplicants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
          <Route path="/applicant/resume" element={<ResumeManagement />} />
          <Route path="/applicant/applications" element={<ApplicationTracking />} />
          <Route path="/applicant/messages" element={<Messages userRole="applicant" />} />
          <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
          <Route path="/organization/post" element={<PostInternship />} />
          <Route path="/organization/applicants" element={<ManageApplicants />} />
          <Route path="/organization/messages" element={<Messages userRole="organization" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<OrganizationApprovals />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
