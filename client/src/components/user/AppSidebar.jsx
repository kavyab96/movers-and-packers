
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import * as Icons from "lucide-react"; // import all icons dynamically
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { sidebarMenu } from "@/config/sidebarMenu"; //  import your menu config

const AppSidebar = () => {
  const role = useSelector((state) => state.user.user?.role);

  // Fetch the correct menu list based on role
  const menuItems = sidebarMenu[role] || sidebarMenu["user"];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TransitBee</SidebarGroupLabel>

          <SidebarMenu>
            {menuItems.map((item, index) => {
              const Icon = Icons[item.icon]; // use icon dynamically

              return (
                // <SidebarMenuItem key={index}>
                //   <SidebarMenuButton asChild>
                //     <NavLink to={item.path}>
                //       <Icon className="h-4 w-4" />
                //       <span>{item.label}</span>
                //     </NavLink>
                //   </SidebarMenuButton>
                // </SidebarMenuItem>
                <SidebarMenuItem key={index}>
                  <NavLink to={item.path} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`
                        flex items-center gap-2
                        ${isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                       `}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>

              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
