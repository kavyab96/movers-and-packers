// import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/features/themeSlice";

export default function ThemeToggle() {

    const theme = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();

    // const [theme, setTheme] = useState(
    //     localStorage.getItem("theme") || "light"
    // );
    // console.log(theme, 'hard ref');

    // useEffect(() => {
    //     if (theme === "dark") {
    //         document.documentElement.classList.add("dark");
    //     } else {
    //         document.documentElement.classList.remove("dark");
    //     }
    //     localStorage.setItem("theme", theme);
    // }, [theme]);

    return (


        <div className={`flex items-center gap-2 border p-1.5 rounded-xl 
         ${theme === "dark"
                ? "border-(--switch-track-dark)"
                : "border-(--switch-track-light)"} `}>

            {/* Sun */}
            {theme === "light" && (
                <Sun className="h-4 w-4 text-(--switch-track-light)" />
            )}

            <Switch
                checked={theme === "dark"}
                onCheckedChange={() => dispatch(toggleTheme())}
                color="theme"
            />

            {/* Moon */}
            {theme === "dark" && (
                <Moon className="h-4 w-4 text-blue-400" />
            )}
        </div>





    );
}
