"use client";

import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
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
