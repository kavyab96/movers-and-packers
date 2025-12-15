import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../../pages/shared/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { logoutService } from "../../services/authServices";
import { persistor } from "../../redux/store";
import { clearUser } from "../../redux/features/userSlice";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/images/new.png";


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { LogOut, User, SunMoon } from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";


const AuthHeader = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();




  const handleLogout = async () => {
    try {
      const res = await logoutService();
      if (res) {
        persistor.purge();
        dispatch(clearUser());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <header
      className="
        sticky top-0 z-50
        w-full
        h-[9vh] md:h-[12vh]
        border-b
        bg-(--header-bg)
        flex justify-center items-center
        backdrop-blur-md
        py-8 md:py-6
      "
    >
      <div
        className="
          w-full max-w-[95%] mx-auto
          flex items-center justify-between
          px-4 md:px-10
          py-2 md:py-4
          bg-(--header-div-bg)
          rounded-lg md:rounded-xl
          border border-white/5
          shadow-md md:shadow-lg
        "
      >
        {/* LEFT + CENTER (mobile-friendly layout) */}
        <div className="relative w-full flex items-center justify-between md:justify-start md:gap-6">
          {/* Hamburger - Mobile only */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Centered Logo on Mobile */}
          <NavLink
            to="/"
            className="
              absolute left-1/2 -translate-x-1/2
              md:static md:translate-x-0
              text-sm md:text-base
              font-semibold
              tracking-tight
              flex items-center justify-center gap-1 md:gap-2"
          >
            <img
              src="/icon.png"
              alt="TransitBee Logo"
              className="h-4 md:h-7"
            />
            <h4>TransitBee</h4>
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 md:gap-6">
          {userData.user && (
            <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                <button
                  className="
                        h-9 w-9
                      rounded-full
                      flex items-center justify-center
                      hover:ring-2 hover:ring-primary/40
                      transition "
                  aria-label="User menu"
                > */}
              {/* <User className="h-4 w-4 opacity-70" />
                    <span className="hidden sm:block text-sm font-medium">
                      {userData.user.name}
                    </span> */}
              {/* <UserAvatar user={userData.user} />
                </button>
              </DropdownMenuTrigger> */}

              <DropdownMenuTrigger asChild>
                <button
                  className="
                      h-9 w-9
                      rounded-full
                      flex items-center justify-center
                      hover:ring-2 hover:ring-primary/40
                      transition
                    "
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userData.user.profile_pic || ""}
                      alt={userData.user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {userData.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>


              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/${userData.user.role}/profile`)
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  <h4> {userData.user.name}'s Profile</h4>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Theme Toggle */}
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <SunMoon className="h-4 w-4" />
                    <span>Theme</span>
                  </div>
                  <ThemeToggle />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
