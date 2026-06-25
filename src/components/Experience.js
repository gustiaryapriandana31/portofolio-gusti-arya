"use client";
import { useState, useEffect } from "react";
import { LuBriefcase, LuCalendar, LuChevronRight } from "react-icons/lu";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";

function getSnippet(htmlStr, maxLength = 130) {
  if (!htmlStr) return "";
  // Strip HTML tags using regex
  const cleanText = htmlStr.replace(/<[^>]*>/g, " ");
  // Replace multiple spaces/newlines with a single space
  const normalizedText = cleanText.replace(/\s+/g, " ").trim();
  if (normalizedText.length <= maxLength) return normalizedText;
  return normalizedText.slice(0, maxLength) + "...";
}

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        let list = Array.isArray(data) ? data : [];
        // Sort BPS experience to the very top
        list.sort((a, b) => {
          const isABps = a.company?.toLowerCase().includes("bps") || a.company?.toLowerCase().includes("badan pusat statistik");
          const isBBps = b.company?.toLowerCase().includes("bps") || b.company?.toLowerCase().includes("badan pusat statistik");
          if (isABps && !isBBps) return -1;
          if (!isABps && isBBps) return 1;
          return 0;
        });
        setExperiences(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pengalaman:", err);
        setLoading(false);
      });
  }, []);

  const getExperienceHtml = (exp) => {
    if (!exp) return "";
    const firstPoint = exp.points[0] || "";
    const isHtml = firstPoint.trim().startsWith("<") || firstPoint.includes("<p>") || firstPoint.includes("<li>") || firstPoint.includes("<strong>");
    if (isHtml) {
      return exp.points.join("");
    }
    return `<ul>${exp.points.map(p => `<li>${p}</li>`).join("")}</ul>`;
  };

  return (
    <section id="experience" className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl 2xl:max-w-[90rem] 3xl:max-w-[110rem] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Pengalaman Kerja & Magang</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            PENGALAMAN PROFESIONAL
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading cards
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="glow-card p-6 flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="h-6 bg-slate-800 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-slate-900 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-800 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-900 rounded w-1/6 mt-6"></div>
              </div>
            ))
          ) : (
            experiences.map((exp, idx) => {
              const isBps = exp.company?.toLowerCase().includes("bps") || exp.company?.toLowerCase().includes("badan pusat statistik");
              
              // Determine card snippet
              const firstPoint = exp.points[0] || "";
              const isHtml = firstPoint.trim().startsWith("<") || firstPoint.includes("<p>") || firstPoint.includes("<li>");
              const displaySnippet = isHtml ? getSnippet(firstPoint, 130) : getSnippet(exp.points.join(" "), 130);

              return (
                <motion.div
                  key={exp.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`glow-card p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                    isBps
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:bg-emerald-950/20 dark:border-emerald-500/40 light:bg-emerald-100/80 light:border-emerald-600/60"
                      : ""
                  }`}
                  onClick={() => setSelectedExperience(exp)}
                >
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                      <div>
                        <h4 className="text-lg font-poppins font-bold text-white hover:text-neon-green transition-colors">
                          {exp.title}
                        </h4>
                        <p className={`font-poppins font-semibold text-sm ${isBps ? "text-emerald-400" : "text-neon-green"}`}>
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] md:text-xs font-ibm-plex-mono text-slate-400 w-fit shrink-0">
                        <LuCalendar size={12} className={isBps ? "text-emerald-400" : "text-neon-green"} />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    {/* Shortened description snippet */}
                    <p className="text-slate-400 text-sm leading-relaxed font-poppins mb-6">
                      {displaySnippet}{" "}
                      <span className={`hover:underline font-semibold inline-flex items-center gap-0.5 text-xs whitespace-nowrap ml-1 ${isBps ? "text-emerald-400" : "text-neon-green"}`}>
                        Selengkapnya →
                      </span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[10px] font-ibm-plex-mono text-slate-500 uppercase tracking-wider">
                    <LuBriefcase size={12} className="text-slate-500" />
                    <span>Magang & Proyek</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal for Selected Experience */}
      <DetailModal
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
        title={selectedExperience?.title}
        subtitle={selectedExperience?.company}
        duration={selectedExperience?.period}
        htmlContent={getExperienceHtml(selectedExperience)}
      />
    </section>
  );
}
