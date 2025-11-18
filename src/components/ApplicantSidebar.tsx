import { Home, FileText, Briefcase, MessageSquare, TrendingUp, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/applicant/dashboard", icon: Home },
  { title: "My Profile", url: "/applicant/profile", icon: User },
  { title: "My Resume", url: "/applicant/resume", icon: FileText },
  { title: "Browse Internships", url: "/applicant/browse", icon: Briefcase },
  { title: "My Applications", url: "/applicant/applications", icon: TrendingUp },
  { title: "Messages", url: "/applicant/messages", icon: MessageSquare },
];

export function ApplicantSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            {open && (
              <span className="text-lg font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                InternConnect
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Applicant Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
