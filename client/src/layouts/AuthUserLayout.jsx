import React from "react";
import { Outlet } from "react-router-dom";

import AuthHeader from "../components/user/AuthHeader";
import Footer from "../components/user/Footer";

import { SidebarProvider, SidebarInset  } from "@/components/ui/sidebar";
import AppSidebar from "../components/user/AppSidebar";

const AuthUserLayout = () => {
  return (
    <SidebarProvider>

      {/* LEFT SIDEBAR */}
      <AppSidebar />

      {/* RIGHT CONTENT AREA */}
      <SidebarInset className="flex flex-col min-h-screen">

        {/* TOP NAV */}
        <AuthHeader />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </SidebarInset>

    </SidebarProvider>
  );
};

export default AuthUserLayout;
