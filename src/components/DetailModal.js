"use client";
import React, { useEffect } from "react";
import { LuX, LuCalendar, LuTarget, LuGlobe, LuExternalLink } from "react-icons/lu";
import ImageSwiper from "./ImageSwiper";

export default function DetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  duration,
  purpose,
  link,
  images = [],
  htmlContent,
  techObjects = []
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key press to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container Card */}
      <div
        className="relative max-w-3xl w-full max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col text-slate-100 font-poppins animate-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing on inside clicks
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-30"
          title="Tutup (Esc)"
        >
          <LuX size={18} />
        </button>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          
          {/* Swiper / Banner Image Container */}
          {images && images.length > 0 && (
            <div className="w-full h-56 md:h-80 relative bg-slate-950 border-b border-slate-800/80">
              <ImageSwiper images={images} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Text & Specs Details Block */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-poppins text-white leading-snug">
                {title}
              </h3>
              <p className="text-sm font-semibold text-accent mt-1 uppercase tracking-wider">{subtitle}</p>
              
              <div className="flex items-center gap-1.5 mt-3 text-xs font-ibm-plex-mono text-slate-400">
                <LuCalendar size={13} className="text-accent" />
                <span>{duration}</span>
              </div>
            </div>

            {/* Links and Actions */}
            {link && (
              <div className="pt-1">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-slate-950 font-bold text-sm tracking-wide transition-all border border-transparent shadow-lg"
                >
                  <LuGlobe size={16} />
                  <span>Kunjungi Projek / Website</span>
                  <LuExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Target / Purpose block */}
            {purpose && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs md:text-sm leading-relaxed text-slate-300">
                <LuTarget size={18} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">Tujuan & Objektif:</strong>
                  <span>{purpose}</span>
                </div>
              </div>
            )}

            {/* Technologies list with actual Devicon logo vector icons and tooltips */}
            {techObjects && techObjects.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase font-ibm-plex-mono text-slate-400 tracking-wider font-bold">Teknologi yang Digunakan:</h4>
                <div className="flex flex-wrap gap-3">
                  {techObjects.map((tech) => (
                    <div 
                      key={tech.id} 
                      className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-medium text-slate-300 hover:border-accent hover:text-white transition-all cursor-default"
                    >
                      {tech.logo.startsWith("devicon-") ? (
                        <i className={`${tech.logo} text-base shrink-0`}></i>
                      ) : (
                        <img src={tech.logo} alt={tech.name} className="w-4 h-4 object-contain shrink-0" />
                      )}
                      <span>{tech.name}</span>
                      
                      {/* Tooltip detail category */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-950 text-[10px] text-accent border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap capitalize shadow-md z-40 font-ibm-plex-mono">
                        {tech.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-slate-800" />

            {/* Rich HTML body description */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-ibm-plex-mono text-slate-400 tracking-wider font-bold">Deskripsi Lengkap:</h4>
              <div 
                className="rich-text-renderer text-sm md:text-base leading-relaxed text-slate-200 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
