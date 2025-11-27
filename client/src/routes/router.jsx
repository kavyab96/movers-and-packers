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
        element: <AuthRoutes> <AuthUserLayout /> </AuthRoutes>,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'profile', element: <Profile /> },
            { path: 'book-service', element: <BookService /> },
            { path: 'bookings', element: <Bookings /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            // { path: "*", element: <ErrorPage /> },
        ]
    },
    {
        path: "/admin",
        element: <AuthRoutes> <AuthUserLayout /> </AuthRoutes>,
        errorElement: <ErrorPage />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'profile', element: <Profile /> },
            { path: "*", element: <ErrorPage /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            // { path: "*", element: <ErrorPage /> },
        ]
    },
    {
        path: "/provider",
        element: <AuthRoutes> <AuthUserLayout /> </AuthRoutes>,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'profile', element: <Profile /> },
            //   { path: '/users', element: <User /> },
            //   { path: '/admin-dashboard', element:<AdminRoute> <AdminDashboard/> </AdminRoute> },
            { path: "*", element: <ErrorPage /> },
        ]
    },

    // FINAL GLOBAL CATCH-ALL (OPTIONAL)
    // Only match things NOT starting with /user, /admin, or /provider
    { path: "*", element: <ErrorPage /> },

    


]);

