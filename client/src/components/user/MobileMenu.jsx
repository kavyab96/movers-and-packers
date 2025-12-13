import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Menu } from "lucide-react";
import * as Icons from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { sidebarMenu } from "@/config/sidebarMenu";
import { useState } from "react";

const MobileMenu = () => {
    const role = useSelector((state) => state.user.user?.role);
    const menuItems = sidebarMenu[role] || [];

    const [open, setOpen] = useState(false);//manage sheet open state

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Hamburger icon */}
            <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-md hover:bg-muted">
                    <Menu className="h-5 w-5" />
                </button>
            </SheetTrigger>

            {/* Drawer */}
            <SheetContent side="left" className="w-64">

                {/* Accessibility-only (hidden) */}
                <VisuallyHidden>
                    <DialogTitle>Mobile navigation</DialogTitle>
                </VisuallyHidden>

                <VisuallyHidden>
                    <DialogDescription>
                        Main navigation menu for the application
                    </DialogDescription>
                </VisuallyHidden>

                <h2 className="text-lg font-semibold mb-4">TransitBee</h2>

                <nav className="space-y-2">
                    {menuItems.map((item, i) => {
                        const Icon = Icons[item.icon];
                        return (
                            <NavLink
                                key={i}
                                to={item.path}
                                onClick={() => setOpen(false)}//close sheet 
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
