"use client";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "./ui/button";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const setDarkTheme = () => setTheme("dark");
  const setLightTheme = () => setTheme("light");

  if (theme === "light") {
    return (
      <Button variant="ghost" onClick={setDarkTheme}>
        <MoonIcon />
      </Button>
    );
  }
  if (theme === "dark") {
    return (
      <Button variant="ghost" onClick={setLightTheme}>
        <SunIcon />
      </Button>
    );
  }
};

export default DarkModeToggle;
