"use client";

import { useEffect, useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setMounted(true);
    // Find initial theme from HTML class or localStorage
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full border border-slate-800 bg-slate-950/20 opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`w-16 h-8 rounded-full relative flex items-center justify-between px-1.5 cursor-pointer select-none transition-all duration-300 focus:outline-none ${
        isDark
          ? "bg-slate-950/80 border border-slate-800 shadow-inner"
          : "bg-[#ffffff] border-2 border-black shadow-[2px_2px_0px_#000000]"
      }`}
      aria-label="Toggle Theme"
    >
      {/* Sun/Moon Icons inside the background track */}
      <div className="flex justify-between items-center w-full px-1">
        <LuMoon
          size={14}
          className={`transition-all duration-300 ${
            isDark ? "text-neon-green/30" : "text-slate-400"
          }`}
        />
        <LuSun
          size={14}
          className={`transition-all duration-300 ${
            isDark ? "text-slate-500" : "text-slate-400/30"
          }`}
        />
      </div>

      {/* Floating sliding thumb with active icon inside */}
      <div
        className={`w-6 h-6 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center justify-center ${
          isDark
            ? "left-[4px] bg-neon-green text-slate-950 shadow-[0_0_8px_rgba(0,255,153,0.5)]"
            : "left-[34px] bg-black text-[#ffffff]"
        }`}
      >
        {isDark ? (
          <LuMoon size={12} className="stroke-[2.5]" />
        ) : (
          <LuSun size={12} className="stroke-[2.5]" />
        )}
      </div>
    </button>
  );
}
