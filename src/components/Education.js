"use client";
import { useState, useEffect } from "react";
import { LuGraduationCap, LuCalendar } from "react-icons/lu";

export default function Education() {
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        setEducationHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pendidikan:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="education" className="py-24 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Histori Pendidikan</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            RIWAYAT PENDIDIKAN
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-slate-800 ml-2 sm:ml-4 md:ml-8 pl-6 sm:pl-8 md:pl-12 space-y-12">
          {loading ? (
            // Skeleton Loading
            [1, 2].map((n) => (
              <div key={n} className="relative animate-pulse">
                <div className="absolute -left-[41px] sm:-left-[49px] md:-left-[61px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-700">
                  <LuGraduationCap size={16} />
                </div>
                <div className="glow-card p-6 md:p-8">
                  <div className="h-6 bg-slate-800 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-slate-900 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            educationHistory.map((edu, idx) => (
              <div key={edu.id || idx} className="relative">
                
                {/* Icon Marker */}
                <div className="absolute -left-[41px] sm:-left-[49px] md:-left-[61px] top-1.5 w-8 h-8 rounded-full bg-slate-950 border-2 border-neon-green flex items-center justify-center text-neon-green shadow-[0_0_10px_rgba(0,255,153,0.3)]">
                  <LuGraduationCap size={16} />
                </div>

                {/* Box Details */}
                <div className="glow-card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <h4 className="text-lg md:text-xl font-poppins font-bold text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-neon-green font-poppins font-medium text-sm md:text-base mt-1">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-ibm-plex-mono text-slate-400 w-fit shrink-0">
                      <LuCalendar size={12} className="text-neon-green" />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
