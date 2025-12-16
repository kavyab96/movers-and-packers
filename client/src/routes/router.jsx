import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "../pages/shared/ErrorPage.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import About from "../pages/user/About.jsx";
import HomePage from "../pages/user/HomePage.jsx";
import Login from "../pages/shared/Login.jsx";
import Register from "../pages/user/Register.jsx";
import ProviderResults from "../pages/user/ProviderResults.jsx";

import AuthUserLayout from "../layouts/AuthUserLayout.jsx";
import Dashboard from "../pages/shared/Dashboard.jsx";
import Profile from "../pages/shared/Profile.jsx";
import AuthRoutes from "./protected/AuthRoutes.jsx";

import BookService from "../pages/client/BookService.jsx";
import Bookings from "../pages/client/Bookings.jsx";
import PaymentPage from "../pages/client/PaymentPage.jsx";
import PaymentFailed from "../pages/client/PaymentFailed.jsx";
import PaymentSuccess from "../pages/client/PaymentSuccess.jsx";

import JobList from "../pages/provider/JobList.jsx";
import Earnings from "../pages/provider/Earnings.jsx";

import UsersList from "../pages/admin/UsersList.jsx";
import BookingList from "../pages/admin/BookingList.jsx";
import ServiceAreasList from "../pages/admin/ServiceAreasList.jsx";

import RoleRoute from "./protected/RoleRoutes.jsx";
import Unauthorized from "../pages/shared/Unauthorized.jsx";
import ChatList from "../pages/shared/ChatList.jsx";
import Chat from "../pages/shared/Chat.jsx";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        // errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            // { path: "", element: <HomePage /> },
            { path: "about", element: <About /> },
            { path: "login", element: <Login /> },
            { path: "signup", element: <Register /> },
            { path: "providers", element: <ProviderResults /> },
            { path: "*", element: <ErrorPage /> },

        ]
    },


    {
        path: "/user",
        element: (
            <AuthRoutes>
                <RoleRoute allowedRoles={["user"]}>
                    <AuthUserLayout />
                </RoleRoute>
            </AuthRoutes>
        ),
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'profile', element: <Profile /> },
            { path: 'book-service', element: <BookService /> },
            { path: 'bookings', element: <Bookings /> },
            { path: 'payment/:id', element: <PaymentPage /> },
            { path: "payment-success", element: <PaymentSuccess /> },
            { path: "payment-failed", element: <PaymentFailed /> },
            { path: "chatlist", element: <ChatList /> },
            { path: "chat", element: <Chat /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            // { path: "*", element: <ErrorPage /> },
        ]
    },
    {
        path: "/admin",
        element: (
            <AuthRoutes>
                <RoleRoute allowedRoles={["admin"]}>
                    <AuthUserLayout />
                </RoleRoute>
            </AuthRoutes>
        ),
        errorElement: < ErrorPage />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'users', element: <UsersList /> },
            { path: 'service-requests', element: <BookingList /> },
            { path: 'service-areas', element: <ServiceAreasList /> },
            { path: 'profile', element: <Profile /> },
            { path: "*", element: <ErrorPage /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            // { path: "*", element: <ErrorPage /> },
        ]
    },
    {
        path: "/provider",
        element: (
            <AuthRoutes>
                <RoleRoute allowedRoles={["provider"]}>
                    <AuthUserLayout />
                </RoleRoute>
            </AuthRoutes>
        ),
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'jobs', element: <JobList /> },
            { path: 'profile', element: <Profile /> },
            { path: 'earnings', element: <Earnings /> },
            { path: "chatlist", element: <ChatList /> },
            { path: "chat", element: <Chat /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            { path: "*", element: <ErrorPage /> },
        ]
    },

    /* ───────── UNAUTHORIZED PAGE ───────── */
    {
        path: "/unauthorized",
        element: <Unauthorized />,
    },

    // FINAL GLOBAL CATCH-ALL (OPTIONAL)
    // Only match things NOT starting with /user, /admin, or /provider
    { path: "*", element: <ErrorPage /> },




]);

