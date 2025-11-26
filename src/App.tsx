import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import AdminSetup from "./pages/AdminSetup";
import AdminEmailConfirmation from "./pages/AdminEmailConfirmation";
import AdminPasswordReset from "./pages/AdminPasswordReset";
import AdminUpdatePassword from "./pages/AdminUpdatePassword";
import RoleSelection from "./pages/RoleSelection";
import OrganizationOnboarding from "./pages/OrganizationOnboarding";
import InternOnboarding from "./pages/InternOnboarding";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/email-confirmation" element={<AdminEmailConfirmation />} />
          <Route path="/admin/password-reset" element={<AdminPasswordReset />} />
          <Route path="/admin/update-password" element={<AdminUpdatePassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/onboarding/role-selection" element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/organization" element={
            <ProtectedRoute requiredRole="organization">
              <OrganizationOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/intern" element={
            <ProtectedRoute requiredRole="intern">
              <InternOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/applicant/dashboard" element={
            <ProtectedRoute requiredRole="intern">
              <ApplicantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/applicant/resume" element={
            <ProtectedRoute requiredRole="intern">
              <ResumeManagement />
            </ProtectedRoute>
          } />
          <Route path="/applicant/applications" element={
            <ProtectedRoute requiredRole="intern">
              <ApplicationTracking />
            </ProtectedRoute>
          } />
          <Route path="/applicant/messages" element={
            <ProtectedRoute requiredRole="intern">
              <Messages userRole="applicant" />
            </ProtectedRoute>
          } />
          <Route path="/organization/dashboard" element={
            <ProtectedRoute requiredRole="organization">
              <OrganizationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/organization/post" element={
            <ProtectedRoute requiredRole="organization">
              <PostInternship />
            </ProtectedRoute>
          } />
          <Route path="/organization/applicants" element={
            <ProtectedRoute requiredRole="organization">
              <ManageApplicants />
            </ProtectedRoute>
          } />
          <Route path="/organization/messages" element={
            <ProtectedRoute requiredRole="organization">
              <Messages userRole="organization" />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/approvals" element={
            <ProtectedRoute requiredRole="admin">
              <OrganizationApprovals />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
