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
          : "bg-white border-2 border-black shadow-[2px_2px_0px_#000000]"
      }`}
      aria-label="Toggle Theme"
    >
      {/* Sun/Moon Icons inside the background track */}
      <div className="flex justify-between items-center w-full px-0.5">
        <LuMoon
          size={14}
          className={`transition-all duration-300 ${
            isDark ? "text-neon-green font-bold opacity-30" : "text-slate-400"
          }`}
        />
        <LuSun
          size={14}
          className={`transition-all duration-300 ${
            isDark ? "text-slate-500" : "text-black opacity-30"
          }`}
        />
      </div>

      {/* Floating sliding thumb with active icon inside */}
      <div
        className={`w-5.5 h-5.5 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center justify-center ${
          isDark
            ? "left-[4px] bg-neon-green text-slate-950 shadow-[0_0_8px_rgba(0,255,153,0.5)]"
            : "left-[32px] bg-black text-white"
        }`}
      >
        {isDark ? (
          <LuMoon size={11} className="stroke-[2.5]" />
        ) : (
          <LuSun size={11} className="stroke-[2.5]" />
        )}
      </div>
    </button>
  );
}
