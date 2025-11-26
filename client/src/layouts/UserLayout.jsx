import React from 'react'
import { Outlet } from "react-router-dom";
import Header from '../components/user/Header.jsx';
import Footer from '../components/user/Footer.jsx';




const UserLayout = () => {
    return (


        <div >
            <main className=" min-h-screen  pb-24">
                <Header />
                <Outlet />
            </main>
            <Footer />
        </div>


    )
}

export default UserLayout