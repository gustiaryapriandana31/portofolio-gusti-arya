  "use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuLaptop, LuLanguages, LuHeart, LuSparkles } from "react-icons/lu";

export default function Skills() {
  const [data, setData] = useState({ skills: [], softSkills: [], hobbies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((resData) => {
        setData({
          skills: Array.isArray(resData.skills) ? resData.skills : [],
          softSkills: Array.isArray(resData.softSkills) ? resData.softSkills : [],
          hobbies: Array.isArray(resData.hobbies) ? resData.hobbies : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data keahlian:", err);
        setLoading(false);
      });
  }, []);

  const hardSkills = data.skills.filter((skill) => skill.category === "hard");
  const languages = data.skills.filter((skill) => skill.category === "language");

  return (
    <section id="skills" className="py-24 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Keahlian & Hobi</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            SKILLS & INTERESTS
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Hard Skills & Languages */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tech Stack Cards */}
            <div className="glow-card p-6 md:p-8">
              <h4 className="flex items-center gap-3 text-lg md:text-xl font-poppins font-bold text-white mb-6">
                <LuLaptop size={20} className="text-neon-green" />
                <span>Tech Stack & Hard Skills</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading ? (
                  // Skeleton loader
                  [1, 2, 3, 4].map((n) => (
                    <div key={n} className="space-y-2 animate-pulse">
                      <div className="flex justify-between h-4 bg-slate-800 rounded w-2/3"></div>
                      <div className="h-2 bg-slate-900 rounded w-full"></div>
                    </div>
                  ))
                ) : (
                  [...hardSkills].sort((a, b) => b.level - a.level).map((skill, idx) => (
                    <div key={skill.id || idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs md:text-sm font-poppins">
                        <span className="font-semibold text-slate-350">{skill.name}</span>
                        <span className={`font-ibm-plex-mono text-[10px] uppercase ${
                          skill.level >= 90 ? "text-neon-green" : skill.level >= 70 ? "text-blue-400" : "text-amber-400"
                        }`}>
                          {skill.label}
                        </span>
                      </div>
                      {/* Bar background */}
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            skill.level >= 90
                              ? "bg-emerald-500 dark:bg-gradient-to-r dark:from-neon-green dark:to-emerald-500"
                              : skill.level >= 70
                              ? "bg-blue-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-500"
                              : "bg-orange-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Languages card */}
            <div className="glow-card p-6 md:p-8">
              <h4 className="flex items-center gap-3 text-lg md:text-xl font-poppins font-bold text-white mb-6">
                <LuLanguages size={20} className="text-neon-green" />
                <span>Bahasa (Languages)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading ? (
                  [1, 2].map((n) => (
                    <div key={n} className="space-y-2 animate-pulse">
                      <div className="flex justify-between h-4 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-2 bg-slate-900 rounded w-full"></div>
                    </div>
                  ))
                ) : (
                  [...languages].sort((a, b) => b.level - a.level).map((lang, idx) => (
                    <div key={lang.id || idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="font-semibold text-slate-350">{lang.name}</span>
                        <span className="text-slate-400 text-xs font-ibm-plex-mono">{lang.label}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-emerald-500 dark:bg-gradient-to-r dark:from-neon-green dark:to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Soft Skills & Hobbies */}
          <div className="lg:col-span-4 space-y-8">
            {/* Soft Skills */}
            <div className="glow-card p-6 md:p-8">
              <h4 className="flex items-center gap-3 text-lg font-poppins font-bold text-white mb-6">
                <LuSparkles size={18} className="text-neon-green" />
                <span>Soft Skills</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {loading ? (
                  [1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-8 bg-slate-850 border border-slate-800/80 rounded-lg w-20 animate-pulse"></div>
                  ))
                ) : (
                  data.softSkills.map((skill, idx) => (
                    <span
                      key={skill.id || idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 text-xs font-poppins hover:border-neon-green/50 hover:text-neon-green transition-all duration-300"
                    >
                      {skill.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Hobbies & Interests */}
            <div className="glow-card p-6 md:p-8">
              <h4 className="flex items-center gap-3 text-lg font-poppins font-bold text-white mb-6">
                <LuHeart size={18} className="text-neon-green" />
                <span>Hobi & Ketertarikan</span>
              </h4>
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/60 border border-slate-850 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  data.hobbies.map((hobby, idx) => (
                    <div
                      key={hobby.id || idx}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-neon-green/30 transition-all duration-300"
                    >
                      <span className="text-2xl w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                        {hobby.icon}
                      </span>
                      <span className="font-poppins text-slate-300 text-sm font-medium">
                        {hobby.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
