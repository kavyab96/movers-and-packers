import { createBrowserRouter } from "react-router-dom";
// import HomePage from "../pages/user/HomePage.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import ErrorPage from "../pages/shared/ErrorPage.jsx";
import About from "../pages/user/About.jsx";
// import Services from "../pages/user/Services.jsx";
import HomePage from "../pages/user/HomePage.jsx";
import Login from "../pages/shared/Login.jsx";
import Register from "../pages/user/Register.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        errorElement: <ErrorPage />,
        children : [
            {
                path:"",
                element: <HomePage />
            },
            {
                path:"about",
                element: <About />
            },

            // {
            //     path:"services",
            //     element: <Services/>
            // },

             {
                path:"login",
                element: <Login/>
            },
            {
                path:"signup",
                element: <Register/>
            }

        ]
    },


]);

