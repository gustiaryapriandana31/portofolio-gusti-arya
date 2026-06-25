"use client";
import { useState, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Education", href: "#education" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Certifications", href: "#certifications" },
    { name: "Feedback", href: "#feedback" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <span className="font-audiowide text-xl md:text-2xl tracking-wider text-white group-hover:text-neon-green transition-colors duration-300">
            AR<span className="text-neon-green">YA</span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-neon-green group-hover:animate-ping"></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-neon-green font-poppins transition-colors duration-300 relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#feedback"
            className="px-5 py-2 rounded-full border border-neon-green text-neon-green text-xs font-semibold hover:bg-neon-green hover:text-slate-950 transition-all duration-300 font-ibm-plex-mono text-center"
          >
            Support Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-neon-green transition-colors p-1"
          aria-label="Toggle Menu"
        >
          {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 h-screen w-screen bg-background transition-all duration-300 ease-in-out z-50 flex flex-col p-6 ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Header Close inside drawer */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-900">
          <span className="font-audiowide text-xl tracking-wider text-white">
            AR<span className="text-neon-green">YA</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:text-neon-green transition-colors p-1"
            aria-label="Close Menu"
          >
            <LuX size={26} />
          </button>
        </div>

        {/* Full-screen Centered Navigation Links */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6 px-6">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-slate-350 hover:text-neon-green font-poppins transition-colors duration-200 transform hover:scale-105"
            >
              {link.name}
            </a>
          ))}
          <div className="py-2 border-t border-slate-900 w-full flex justify-center">
            <ThemeToggle />
          </div>
          <a
            href="#feedback"
            onClick={() => setIsOpen(false)}
            className="w-full max-w-xs text-center py-2.5 rounded-full border border-neon-green text-neon-green text-sm font-semibold hover:bg-neon-green hover:text-slate-950 transition-all duration-300 font-ibm-plex-mono"
          >
            Support Me
          </a>
        </div>
      </div>
    </nav>
  );
}
