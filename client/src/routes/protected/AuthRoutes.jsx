import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from "react-redux"

const AuthRoutes = ({ children }) => {

    const user = useSelector((state) => state.user.user);

    const isAuthenticated = user && Object.keys(user).length > 0;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;

}

export default AuthRoutes