import { Outlet } from "react-router-dom";

import AuthHeader from "../components/user/AuthHeader";
import Footer from "../components/user/Footer";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/user/AppSidebar";
import { useState } from "react";

const AuthUserLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {/* ROOT FLEX WRAPPER */}
      <div className="flex min-h-screen w-full">

        {/* LEFT SIDEBAR */}
        <AppSidebar />

        {/* RIGHT CONTENT AREA */}
        <SidebarInset className="flex flex-col flex-1 min-h-screen">

          {/* TOP NAV */}
          <AuthHeader />

          {/* PAGE CONTENT */}
          <main className="flex-1 w-full min-h-screen p-6">
            <Outlet />
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider >
  );
};

export default AuthUserLayout;
