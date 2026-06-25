"use client";
import { useState, useEffect } from "react";
import { LuAward, LuExternalLink, LuCalendar, LuTrophy, LuX, LuChevronLeft, LuChevronRight, LuEye } from "react-icons/lu";
import { motion } from "framer-motion";

export default function Certifications() {
  const [data, setData] = useState({ certifications: [], achievements: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedAchForPreview, setSelectedAchForPreview] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then((resData) => {
        setData({
          certifications: Array.isArray(resData.certifications) ? resData.certifications : [],
          achievements: Array.isArray(resData.achievements) ? resData.achievements : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data sertifikasi & prestasi:", err);
        setLoading(false);
      });
  }, []);

  const scrollTrack = (offset) => {
    const track = document.getElementById("certifications-track");
    if (track) {
      track.scrollLeft += offset;
    }
  };

  return (
    <section id="certifications" className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl 2xl:max-w-[90rem] 3xl:max-w-[110rem] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Sertifikasi & Prestasi</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            CERTIFICATIONS & AWARDS
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        {/* Section: Achievements */}
        <div className="mb-20">
          <h4 className="flex items-center gap-3 text-xl md:text-2xl font-poppins font-bold text-white mb-8">
            <LuTrophy className="text-neon-green" size={24} />
            <span>Prestasi Kompetisi (Achievements)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="glow-card p-6 border border-slate-800/80 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-900 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-slate-800 rounded w-full mb-1"></div>
                  <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                </div>
              ))
            ) : (
              data.achievements.map((ach, idx) => (
                <motion.div
                  key={ach.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glow-card p-6 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between h-full"
                >
                  {/* Gold Trophy Icon on Top Right */}
                  <div
                    className={`absolute top-6 right-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] shrink-0 z-10 ${
                      ach.images && ach.images.length > 0 ? "bg-slate-950/80 p-1.5 rounded-full border border-slate-800" : ""
                    }`}
                  >
                    <LuTrophy size={ach.images && ach.images.length > 0 ? 14 : 22} className="animate-pulse-slow" />
                  </div>

                  {/* Achievement Image Column */}
                  {ach.images && ach.images.length > 0 && (
                    <div className="w-full mb-4 shrink-0">
                      <div className="w-full h-44 relative rounded-lg overflow-hidden border border-slate-800/60 bg-slate-900/40">
                        <img
                          src={ach.images[0]}
                          alt={ach.title}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {ach.images.length > 1 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                          {ach.images.slice(1).map((img, i) => (
                            <div key={i} className="w-10 h-10 rounded border border-slate-800 overflow-hidden shrink-0">
                              <img src={img} alt="doc" className="object-cover w-full h-full" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Details */}
                  <div className="flex-1 pr-6 flex flex-col">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-ibm-plex-mono text-slate-400 w-fit mb-4">
                      <LuCalendar size={12} className="text-neon-green" />
                      <span>{ach.period}</span>
                    </div>
                    
                    <h5 className="font-poppins font-bold text-white text-base mb-1 hover:text-neon-green transition-colors">
                      {ach.title}
                    </h5>
                    <p className="text-xs text-neon-green font-medium mb-3">{ach.event}</p>
                    <p className="text-slate-400 text-xs leading-relaxed font-poppins mb-4">
                      {ach.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  {((ach.link && ach.link !== "#") || (ach.images && ach.images.length > 0)) && (
                    <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between gap-4 text-xs font-ibm-plex-mono shrink-0">
                      <div>
                        {ach.link && ach.link !== "#" && (
                          <a
                            href={ach.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-neon-green transition-colors flex items-center gap-1.5"
                          >
                            <span>Buka Link</span>
                            <LuExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      
                      {ach.images && ach.images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAchForPreview(ach);
                            setActiveImageIdx(0);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold hover:bg-accent hover:text-slate-950 transition-all font-poppins text-xs cursor-pointer flex items-center gap-1"
                        >
                          <LuEye size={12} />
                          <span>Lihat Sertifikat</span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Section: Certifications */}
        <div>
          <h4 className="flex items-center gap-3 text-xl md:text-2xl font-poppins font-bold text-white mb-8">
            <LuAward className="text-neon-green" size={24} />
            <span>Lisensi & Sertifikasi Akademik</span>
          </h4>
          
          <div className="relative group/track">
            {/* Scroll navigation arrows */}
            <button
              onClick={() => scrollTrack(-320)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-20 opacity-0 group-hover/track:opacity-100 hidden md:block"
              title="Geser Kiri"
            >
              <LuChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollTrack(320)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-20 opacity-0 group-hover/track:opacity-100 hidden md:block"
              title="Geser Kanan"
            >
              <LuChevronRight size={20} />
            </button>

            {/* Horizontal Slider Track */}
            <div
              id="certifications-track"
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth select-none"
              style={{ scrollbarWidth: "thin" }}
            >
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="flex-shrink-0 w-[290px] md:w-[320px] glow-card p-6 border-slate-900 animate-pulse flex flex-col justify-between h-48">
                    <div>
                      <div className="h-5 bg-slate-800 rounded w-5/6 mb-3"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-900 rounded w-1/3"></div>
                    </div>
                    <div className="h-8 bg-slate-900 rounded w-full mt-4"></div>
                  </div>
                ))
              ) : (
                data.certifications.map((cert, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={cert.id || idx}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`flex-shrink-0 w-[290px] md:w-[330px] snap-start glow-card border-slate-900 overflow-hidden cursor-pointer ${
                        isEven ? "cert-card-tilt-left" : "cert-card-tilt-right"
                      }`}
                      onClick={() => setSelectedCert(cert)}
                    >
                      {/* Certificate Document Thumbnail Preview with View Detail Zoom Overlay */}
                      <div className="relative h-40 w-full bg-slate-950/80 border-b border-slate-850 overflow-hidden group/image">
                        {cert.image ? (
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover/image:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center">
                            <LuAward size={40} className="text-neon-green/60 mb-1.5 animate-pulse-slow" />
                            <span className="text-[10px] font-ibm-plex-mono text-slate-400 uppercase tracking-wider">{cert.issuer}</span>
                          </div>
                        )}
                        
                        {/* Interactive Zoom Overlay */}
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg">
                            <span>Lihat Kredensial</span>
                            <LuChevronRight size={12} className="text-neon-green" />
                          </span>
                        </div>
                      </div>

                      {/* Card details */}
                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-ibm-plex-mono text-slate-500 tracking-wider block uppercase">
                          {cert.id.split("-")[0].toUpperCase()}
                        </span>
                        
                        <h5 className="font-poppins font-bold text-white text-sm md:text-base leading-snug line-clamp-2 hover:text-neon-green transition-colors">
                          {cert.title}
                        </h5>
                        
                        <p className="text-xs text-slate-400 font-poppins">{cert.issuer}</p>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-900/60">
                          <span className="text-[9px] font-ibm-plex-mono text-slate-500 uppercase tracking-wider">
                            ISSUED IN {cert.period.toUpperCase()}
                          </span>
                          
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-neon-green transition-colors"
                            >
                              <LuExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Side-by-Side Modal for selected Certificate */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-slate-300 font-poppins animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-30"
              title="Tutup (Esc)"
            >
              <LuX size={18} />
            </button>

            {/* Left Column: Certificate Preview Document */}
            <div className="md:w-3/5 bg-slate-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800/80">
              {selectedCert.image ? (
                <div className="w-full h-full max-h-[60vh] flex items-center justify-center">
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="max-w-full max-h-[45vh] object-contain rounded border border-slate-800 shadow-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-800 p-8 text-center">
                  <LuAward size={64} className="text-neon-green mb-3 animate-pulse-slow" />
                  <h4 className="text-white font-bold text-base leading-snug">{selectedCert.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-ibm-plex-mono">{selectedCert.issuer}</p>
                </div>
              )}
            </div>

            {/* Right Column: Credentials metadata info */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <h3 className="text-base md:text-lg font-bold font-poppins text-white leading-snug">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs font-semibold text-neon-green mt-1 uppercase tracking-wider">
                    {selectedCert.issuer}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-850">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Credential ID</span>
                    <p className="text-xs font-ibm-plex-mono text-slate-300 select-all truncate" title={selectedCert.id}>
                      {selectedCert.id.toUpperCase()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Tanggal Terbit</span>
                    <p className="text-xs text-slate-300">{selectedCert.period}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Organisasi Penerbit</span>
                    <p className="text-xs text-slate-300">{selectedCert.issuer}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Status Verifikasi</span>
                    <p className="text-[10px] font-bold text-emerald-400 font-ibm-plex-mono bg-emerald-950/30 px-2.5 py-0.5 border border-emerald-500/20 rounded w-fit uppercase tracking-wider">
                      Aktif / Terverifikasi
                    </p>
                  </div>
                </div>
              </div>

              {selectedCert.link && (
                <div className="pt-4 border-t border-slate-850">
                  <a
                    href={selectedCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-poppins font-bold text-xs tracking-wide transition-all bg-accent text-slate-950 hover:bg-accent-hover border border-transparent shadow-lg"
                  >
                    <span>Credential URL</span>
                    <LuExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Side-by-Side Modal for selected Achievement */}
      {selectedAchForPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAchForPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-slate-300 font-poppins animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAchForPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-30"
              title="Tutup (Esc)"
            >
              <LuX size={18} />
            </button>

            {/* Left Column: Image Viewer */}
            <div className="md:w-3/5 bg-slate-950 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800/80">
              <div className="w-full h-full min-h-[250px] max-h-[50vh] flex items-center justify-center relative">
                <img
                  src={selectedAchForPreview.images[activeImageIdx]}
                  alt={selectedAchForPreview.title}
                  className="max-w-full max-h-[40vh] object-contain rounded border border-slate-800 shadow-lg"
                />
              </div>

              {/* Thumbnails if multiple images */}
              {selectedAchForPreview.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                  {selectedAchForPreview.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-12 h-12 rounded border overflow-hidden shrink-0 transition-all ${
                        activeImageIdx === idx ? "border-accent scale-105" : "border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <img src={img} alt="thumb" className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Metadata info */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[9px] font-ibm-plex-mono text-slate-500 uppercase tracking-widest block mb-1">
                    Detail Prestasi Lomba
                  </span>
                  <h3 className="text-base md:text-lg font-bold font-poppins text-white leading-snug">
                    {selectedAchForPreview.title}
                  </h3>
                  <p className="text-xs font-semibold text-neon-green mt-1 uppercase tracking-wider">
                    {selectedAchForPreview.event}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-850 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Tanggal Event</span>
                    <p className="text-xs text-slate-300">{selectedAchForPreview.period}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-ibm-plex-mono text-slate-500 font-bold tracking-wider block">Deskripsi Prestasi</span>
                    <p className="text-xs text-slate-400 leading-relaxed max-h-[20vh] overflow-y-auto pr-1">
                      {selectedAchForPreview.description}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAchForPreview.link && selectedAchForPreview.link !== "#" && (
                <div className="pt-4 border-t border-slate-850">
                  <a
                    href={selectedAchForPreview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-poppins font-bold text-xs tracking-wide transition-all bg-accent text-slate-950 hover:bg-accent-hover border border-transparent shadow-lg"
                  >
                    <span>Link Verifikasi / Sertifikat</span>
                    <LuExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

