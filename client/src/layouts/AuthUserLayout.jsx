import { Outlet } from "react-router-dom";

import AuthHeader from "../components/user/AuthHeader";
import Footer from "../components/user/Footer";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/user/AppSidebar";
import { useState, useEffect } from "react";

import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";


const AuthUserLayout = () => {
  const [open, setOpen] = useState(true);

  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      socket.emit("join", user._id);
    });

    // return () => {
    //   socket.disconnect(); // clean up on logout
    // };
  }, [user]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {/* ROOT FLEX WRAPPER */}
      {/* <div className="flex min-h-screen w-full"> */}
      <div className="flex min-h-screen w-full ">

        {/* LEFT SIDEBAR */}
        <AppSidebar />

        {/* RIGHT CONTENT AREA */}
        <SidebarInset className="flex flex-col flex-1 ">

          {/* TOP NAV */}
          <AuthHeader />

          {/* PAGE CONTENT */}
          <main className="flex-1 w-full min-h-[95vh] py-10 px-4 mb-20 ">
            <Outlet />
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider >
  );
};

export default AuthUserLayout;
