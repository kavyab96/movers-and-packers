import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from "../../pages/shared/DarkMode";
import { useDispatch, useSelector } from "react-redux"
import { logoutService } from '../../services/authServices';
import { persistor } from '../../redux/store';
import { clearUser } from '../../redux/features/userSlice';
import MobileMenu from "./MobileMenu"
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { LogOut, User,SunMoon } from "lucide-react";


const AuthHeader = () => {
  const userData = useSelector((state) => state.user)
  console.log(userData, 'from auth header');
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await logoutService()
      if (res) {
        persistor.purge();
        dispatch(clearUser())
        navigate("/")
      }
    } catch (error) {
      console.log(error);

    }
  }




  return (
    <header
      className="w-full h-[12vh] border-b bg-(--header-bg) transition-colors flex justify-center items-center  ">
      <div className="w-full max-w-[95%] mx-auto  flex items-center justify-between py-2 sm:py-4 px-10 bg-(--header-div-bg) transition-colors rounded-xl 
     backdrop-blur-3xl border border-white/5 shadow-lg ">
        {/* <div className='flex gap-4 items-center justify-center'>

       
        {/* Logo */}
        {/* <NavLink  className="text-2xl font-bold" >
          <h1 className='text-[1rem] md:text-[1.2rem] lg:text-[1.5rem]'>TransitBee </h1>
        </NavLink> */}

        <div className="flex items-center gap-3">

          {/* Hamburger (MOBILE ONLY) */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <NavLink className="text-2xl font-bold">
            <h1 className="text-[1rem] md:text-[1.2rem] lg:text-[1.5rem]">
              TransitBee
            </h1>
          </NavLink>
        </div>
        {/* </div> */}

        {/* RIGHT SIDE BLOCK (menu + join us) */}
        <div className=" flex items-center gap-4  md:gap-8 font-medium ">
          {/* Menu items */}
          <nav className="flex items-center gap-6 ">

            {/* {userData.user &&
              <div><span>{userData.user.name}</span>
                <button className='ms-5' onClick={handleLogout}>logout</button>
              </div>

            } */}


            {userData.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {userData.user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">

                  <DropdownMenuItem
                    onClick={() => navigate(`/${userData.user.role}/profile`)}
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>


                  <DropdownMenuSeparator />

                  {/* Theme toggle */}
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} // prevent menu close
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <SunMoon className="h-4 w-4" />
                      {/* <span>Theme</span> */}
                    <ThemeToggle />
                    </div>

                  </DropdownMenuItem>


                </DropdownMenuContent>
              </DropdownMenu>
            )}


            {/* <NavLink to="/"  className={
                  ({ isActive }) => isActive
                    ? "text-amber-800 font-semibold"
                    : "hover:text-amber-600"
                }>Home</NavLink> */}
            {/* Join Us */}
            {/* <NavLink to="/login" className={({ isActive }) => isActive? "text-amber-800 font-semibold": "hover:text-amber-600"}>Join Us</NavLink> */}
            
          </nav>

        </div>






      </div>
    </header>
  )
}

export default AuthHeader