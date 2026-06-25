"use client";
import { useState, useEffect } from "react";
import { LuFolderGit2, LuCalendar, LuExternalLink, LuTarget } from "react-icons/lu";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";
import ImageSwiper from "./ImageSwiper";

function getSnippet(htmlStr, maxLength = 130) {
  if (!htmlStr) return "";
  // Strip HTML tags using regex
  const cleanText = htmlStr.replace(/<[^>]*>/g, " ");
  // Replace multiple spaces/newlines with a single space
  const normalizedText = cleanText.replace(/\s+/g, " ").trim();
  if (normalizedText.length <= maxLength) return normalizedText;
  return normalizedText.slice(0, maxLength) + "...";
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data proyek:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-24 border-t border-slate-900 bg-slate-950/10 relative">
      <div className="max-w-7xl 2xl:max-w-[90rem] 3xl:max-w-[110rem] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Karya & Projek</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            PROYEK PILIHAN
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton Loader
            [1, 2].map((n) => (
              <div key={n} className="glow-card p-6 md:p-8 animate-pulse flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-full h-48 bg-slate-800 rounded-lg mb-6"></div>
                  <div className="h-6 bg-slate-800 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-slate-900 rounded w-1/3 mb-4"></div>
                  <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-5/6 mb-4"></div>
                </div>
                <div className="h-10 bg-slate-900 rounded w-full"></div>
              </div>
            ))
          ) : (
            projects.map((proj, idx) => (
              <motion.div
                key={proj.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="glow-card p-6 md:p-8 flex flex-col justify-between h-full relative group overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(proj)}
              >
                <div>
                  {/* Project Image */}
                  {proj.images && proj.images.length > 0 ? (
                    <div className="w-full mb-6 shrink-0">
                      <div className="w-full h-48 relative rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950/40">
                        {proj.images.length > 1 ? (
                          <ImageSwiper images={proj.images} className="h-full w-full object-cover" />
                        ) : (
                          <img
                            src={proj.images[0]}
                            alt={proj.name}
                            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg border border-slate-800/60 bg-slate-950/50 flex flex-col items-center justify-center text-slate-600 mb-6 group-hover:border-neon-green/30 transition-colors">
                      <LuFolderGit2 size={48} className="text-slate-700 mb-2 group-hover:text-neon-green/60 transition-colors" />
                      <span className="text-xs font-ibm-plex-mono">No Preview Image</span>
                    </div>
                  )}

                  {/* Date & Title */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-ibm-plex-mono text-slate-400">
                      <LuCalendar size={12} className="text-neon-green" />
                      <span>{proj.duration}</span>
                    </div>
                  </div>

                  <h4 className="text-lg md:text-xl font-poppins font-bold text-white group-hover:text-neon-green transition-colors mb-3 leading-snug">
                    {proj.name}
                  </h4>

                  {/* Simplified short description snippet */}
                  <p className="text-slate-400 text-sm leading-relaxed font-poppins mb-4">
                    {getSnippet(proj.description, 130)}{" "}
                    <span className="text-neon-green hover:underline font-semibold inline-flex items-center gap-0.5 text-xs whitespace-nowrap ml-1">
                      Selengkapnya →
                    </span>
                  </p>

                  {/* Project Purpose */}
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 text-slate-350 text-xs mb-5 font-poppins">
                    <LuTarget size={14} className="text-neon-green mt-0.5 shrink-0" />
                    <span><strong className="text-white">Tujuan: </strong>{proj.purpose}</span>
                  </div>

                  {/* Technologies list with actual Devicon logo vector icons and tooltips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.techObjects && proj.techObjects.length > 0 ? (
                      proj.techObjects.map((tech) => (
                        <div 
                          key={tech.id} 
                          className="group relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-neon-green/45 text-slate-300 hover:text-white transition-all cursor-default"
                        >
                          {tech.logo.startsWith("devicon-") ? (
                            <i className={`${tech.logo} text-base shrink-0`}></i>
                          ) : (
                            <img src={tech.logo} alt={tech.name} className="w-4 h-4 object-contain shrink-0" />
                          )}
                          
                          {/* Tooltip detail name */}
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-950 text-[10px] text-neon-green border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-40 font-ibm-plex-mono">
                            {tech.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      proj.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-ibm-plex-mono text-slate-400"
                        >
                          {tech}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer Link Button */}
                {proj.link && (
                  <div className="pt-4 border-t border-slate-900/60 dark:border-slate-800/40">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Stop propagation to prevent opening the modal
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-poppins font-bold text-sm tracking-wide transition-all bg-accent text-slate-950 hover:bg-accent-hover border-2 border-slate-950 dark:border-transparent shadow-[3px_3px_0px_#000000] dark:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] dark:hover:translate-x-0 dark:hover:translate-y-0"
                    >
                      <span>Kunjungi Projek</span>
                      <LuExternalLink size={16} />
                    </a>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

      </div>

      {/* Pop-up Detail Modal */}
      <DetailModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name}
        subtitle="Proyek Pilihan"
        duration={selectedProject?.duration}
        purpose={selectedProject?.purpose}
        link={selectedProject?.link}
        images={selectedProject?.images}
        htmlContent={selectedProject?.description}
        techObjects={selectedProject?.techObjects}
      />
    </section>
  );
}

