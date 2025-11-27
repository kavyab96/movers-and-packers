// import React from 'react'
// import { Outlet } from "react-router-dom";
// import AuthHeader from '../components/user/AuthHeader.jsx';
// import Footer from '../components/user/Footer.jsx';




// const AuthUserLayout = () => {
//     return (


//         <div >
//             <main className=" min-h-screen  pb-24">
//                 <AuthHeader />
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>


//     )
// }

// export default AuthUserLayout



// import React from "react";
// import { Outlet } from "react-router-dom";
// import AuthHeader from "../components/user/AuthHeader";
// import Footer from "../components/user/Footer";



// import { SidebarProvider } from "@/components/ui/sidebar";
// import AppSidebar from "../components/user/AppSidebar";

// // const AuthUserLayout = () => {
// //   return (
// //     <SidebarProvider>

// //       {/* FULL PAGE CONTAINER */}
// //       <div className="min-h-screen flex flex-col bg-background">

// //         {/* TOP NAV */}
// //         <AuthHeader />

// //         <div className="flex flex-1">

// //           {/* LEFT SIDEBAR */}
// //           <Sidebar className="border-r w-64">
// //             <SidebarContent>

// //               <SidebarGroup>
// //                 <SidebarGroupLabel>Dashboard</SidebarGroupLabel>

// //                 <SidebarMenu>
// //                   <SidebarMenuItem>
// //                     <SidebarMenuButton asChild>
// //                       <a href="/user/dashboard">
// //                         <Home className="h-4 w-4" />
// //                         <span>Dashboard</span>
// //                       </a>
// //                     </SidebarMenuButton>
// //                   </SidebarMenuItem>

// //                   <SidebarMenuItem>
// //                     <SidebarMenuButton asChild>
// //                       <a href="/user/profile">
// //                         <User className="h-4 w-4" />
// //                         <span>Profile</span>
// //                       </a>
// //                     </SidebarMenuButton>
// //                   </SidebarMenuItem>

// //                   <SidebarMenuItem>
// //                     <SidebarMenuButton asChild>
// //                       <a href="/user/settings">
// //                         <Settings className="h-4 w-4" />
// //                         <span>Settings</span>
// //                       </a>
// //                     </SidebarMenuButton>
// //                   </SidebarMenuItem>
// //                 </SidebarMenu>

// //               </SidebarGroup>

// //             </SidebarContent>
// //           </Sidebar>

// //           {/* RIGHT SIDE MAIN CONTENT */}
// //           <div className="flex-1 p-6">
// //             <Outlet />
// //           </div>

// //         </div>

// //         <Footer />

// //       </div>

// //     </SidebarProvider>
// //   );
// // };

// const AuthUserLayout = () => {
//   return (
//     <SidebarProvider>
//       <AuthHeader />

//       {/* TOP NAVBAR */}

//       <div className="flex min-h-screen">

//         {/* LEFT SIDEBAR */}
//         <AppSidebar />

//         {/* MAIN CONTENT */}
//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>

//       </div>

//       <Footer />
//     </SidebarProvider>
//   );
// };
// export default AuthUserLayout;


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
