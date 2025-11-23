import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"

export default function ThemeToggle() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (

        <div className="flex items-center gap-2">           
            <div className={`flex items-center gap-2 border p-2 rounded-xl
                    ${theme === "dark" 
                    ? "border-(--switch-track-dark)" 
                    : "border-(--switch-track-light)"} 
                `}>
           

                {/* Show Sun only in LIGHT mode */}
               {theme !== 'dark' && (
                    <label htmlFor="theme-switch">
                        <Sun className="h-4 w-4 cursor-pointer text-(--switch-track-light)" />
                    </label>
                )}

                <Switch
                    theme={theme}
                    onCheckedChange={(value) =>
                        setTheme(value ? "dark" : "light")
                    }

                   color="theme"
                    id="theme-switch"
                />

                {/* Show Moon only in DARK mode */}
                 {theme === 'dark' && (
                    <label htmlFor="theme-switch">
                        <Moon className="h-4 w-4 cursor-pointer text-(--switch-track-dark)" />
                    </label>
                )}
            </div>
        </div>
    );
}
