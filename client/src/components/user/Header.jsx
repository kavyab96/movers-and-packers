import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ThemeToggle from "../../pages/shared/DarkMode";

const Header = () => {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md transition ${
    isActive
      ? "bg-amber-100 text-amber-800 font-semibold"
      : "hover:bg-muted"
  }`;


  return (
    <header
      className="w-full h-[12vh] border-b bg-(--header-bg) transition-colors flex justify-center items-center  ">
      <div className="w-full max-w-[95%] mx-auto  flex items-center justify-between py-2 sm:py-4 px-10 bg-(--header-div-bg) transition-colors rounded-xl 
     backdrop-blur-3xl border border-white/5 shadow-lg ">

        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold" >
          <h1 className='text-[1rem] md:text-[1.2rem] lg:text-[1.5rem]'>TransitBee </h1>
        </NavLink>

        {/* RIGHT SIDE BLOCK (menu + join us) */}
        <div className="hidden  sm:flex items-center gap-8 font-medium ">
          {/* Menu items */}
          <nav className="flex items-center gap-6 ">
            <NavLink to="/" 
            className={
              ({ isActive }) => isActive
                ? "text-amber-800 font-semibold"
                : "hover:text-amber-600"
            }
            >Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-amber-800 font-semibold" : "hover:text-amber-600"}>About</NavLink>
            {/* <NavLink to="/services" className="hover:text-primary transition">Services</NavLink> */}
            {/* Join Us */}
            <NavLink to="/login" className={({ isActive }) => isActive ? "text-amber-800 font-semibold" : "hover:text-amber-600"}>Join Us</NavLink>
          </nav>
          <ThemeToggle />

        </div>

        {/* mobile hamurger menu */}

        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-6">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">
                  TransitBee
                </SheetTitle>

                <div className="mt-6 flex flex-col gap-4 text-sm">
                  <NavLink to="/" className={({ isActive }) => isActive ? "text-amber-800 font-semibold" : "hover:text-amber-600"} onClick={() => setOpen(false)}>
                    Home
                  </NavLink>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "text-amber-800 font-semibold" : "hover:text-amber-600"}
                    onClick={() => setOpen(false)}>
                    About
                  </NavLink>
                  {/* <NavLink to="/services" className={({ isActive }) => isActive? "text-amber-800 font-semibold": "hover:text-amber-600"} onClick={() => setOpen(false)}>
                    Services
                  </NavLink> */}
                  <NavLink to="/login" className={({ isActive }) => isActive ? "text-amber-800 font-semibold" : "hover:text-amber-600"} onClick={() => setOpen(false)}>
                    Join Us
                  </NavLink>

                  {/* Theme Toggle  */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm">Theme</span>
                    <ThemeToggle />
                  </div>

                </div>
              </SheetHeader>
            </SheetContent>

          </Sheet>
        </div>
        {/* mobile hamurger menu */}


      </div>
    </header>
  );
}

export default Header;
