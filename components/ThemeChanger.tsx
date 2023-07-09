"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeChanger() {
    const { resolvedTheme, setTheme } = useTheme();
    const alternateTheme = resolvedTheme == "light" ? "dark" : "light";

    return (
        <Button
            variant="ghost"
            size="icon"
            className="px-0"
            onClick={() => setTheme(alternateTheme)}
        >
            <Sun className="h-4 w-4 scale-100 dark:scale-0" />
            <Moon className="absolute h-4 w-4 scale-0 dark:scale-100" />
        </Button>
    );
}
