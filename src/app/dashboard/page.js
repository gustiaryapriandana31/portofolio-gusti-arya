"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuLogOut,
  LuBookOpen,
  LuBriefcase,
  LuSparkles,
  LuAward,
  LuFolder,
  LuCheck,
  LuCircleAlert,
  LuEye,
  LuCode
} from "react-icons/lu";

// Import modular tab components
import EducationTab from "@/components/dashboard/EducationTab";
import ExperienceTab from "@/components/dashboard/ExperienceTab";
import SkillsTab from "@/components/dashboard/SkillsTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";
import ProjectsTab from "@/components/dashboard/ProjectsTab";
import TechStackTab from "@/components/dashboard/TechStackTab";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("education");

  // Global Alert Message states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const showMsg = (type, text) => {
    if (type === "success") {
      setSuccessMessage(text);
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setErrorMessage(text);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      showMsg("error", "Gagal melakukan logout.");
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "education":
        return <EducationTab showMsg={showMsg} />;
      case "experience":
        return <ExperienceTab showMsg={showMsg} />;
      case "skills":
        return <SkillsTab showMsg={showMsg} />;
      case "certifications":
        return <CertificationsTab showMsg={showMsg} />;
      case "projects":
        return <ProjectsTab showMsg={showMsg} />;
      case "techstack":
        return <TechStackTab showMsg={showMsg} />;
      default:
        return <EducationTab showMsg={showMsg} />;
    }
  };

  return (
    <div className="force-dark min-h-screen bg-background text-foreground flex flex-col font-poppins">
      
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
            <LuAward size={18} />
          </div>
          <h1 className="text-lg md:text-xl font-audiowide font-bold text-white tracking-wide uppercase">
            Dashboard Admin
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-xs font-ibm-plex-mono text-slate-400 hover:text-white transition-all border border-slate-800"
          >
            <LuEye size={14} />
            <span>Lihat Web</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-red-950/20 hover:bg-red-950/40 text-xs font-ibm-plex-mono text-red-400 hover:text-red-300 transition-all border border-red-900/30"
          >
            <LuLogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Message Notifications */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-4">
        {successMessage && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-sm font-poppins shadow-lg">
            <LuCheck size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-poppins shadow-lg">
            <LuCircleAlert size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Dashboard Wrapper Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-2 scrollbar-none snap-x snap-mandatory shrink-0">
          {[
            { id: "education", name: "Pendidikan", icon: LuBookOpen },
            { id: "experience", name: "Pengalaman Kerja", icon: LuBriefcase },
            { id: "skills", name: "Skills & Interests", icon: LuSparkles },
            { id: "certifications", name: "Sertifikat & Penghargaan", icon: LuAward },
            { id: "projects", name: "Proyek", icon: LuFolder },
            { id: "techstack", name: "Tech Stack", icon: LuCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-left text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal shrink-0 snap-start w-auto lg:w-full ${
                  isActive
                    ? "bg-accent/10 border border-accent/20 text-accent font-semibold text-glow"
                    : "bg-slate-900/30 border border-transparent hover:bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab content display area */}
        <section className="lg:col-span-3 space-y-6">
          {renderActiveTabContent()}
        </section>
      </main>
      
      {/* Tiny Footer */}
      <footer className="py-6 border-t border-slate-950 text-center text-[10px] text-slate-650 font-ibm-plex-mono mt-8 bg-slate-950">
        © 2026 Arya Priandana • Dashboard Admin Panel • Protected Session
      </footer>

    </div>
  );
}
