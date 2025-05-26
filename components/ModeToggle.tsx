"use client";

import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

interface IModeToggleProps {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}

const ModeToggle = ({ variant = "outline" }: IModeToggleProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <LucideSun className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <LucideMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export default ModeToggle;
