"use client";
import { motion } from "framer-motion";
import { LuGithub, LuInstagram, LuFacebook, LuTwitter, LuMail, LuPhone, LuMapPin, LuDownload } from "react-icons/lu";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center items-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 hero-radial-glows pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Bio Details */}
        <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-neon-green font-ibm-plex-mono text-xs font-semibold uppercase tracking-wider mb-5">
              Web Developer / Software Engineer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-audiowide font-bold text-white tracking-tight mb-4 leading-tight"
          >
            M. GUSTI ARYA <br />
            <span className="text-brand-gradient font-bold">
              PRIANDANA, S.KOM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 font-poppins text-base md:text-lg max-w-xl mb-8 leading-relaxed"
          >
            Saya adalah pengembang web lulusan Ilmu Komputer dengan fokus pada front-end dan sistem manajemen informasi. Berpengalaman membangun aplikasi end-to-end yang responsif dan user-friendly menggunakan ekosistem modern Laravel dan ReactJS.
          </motion.p>

          {/* Quick Contact Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 font-ibm-plex-mono text-xs text-slate-400"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <LuMapPin size={14} className="text-[var(--orbit-inner-color)]" />
              <span>Ogan Ilir, Sumatera Selatan</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <LuMail size={14} className="text-[var(--orbit-outer-color)]" />
              <span>gustiaryapriandana@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <LuPhone size={14} className="text-[var(--orbit-inner-color)]" />
              <span>082281963857</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mb-10"
          >
            <a
              href="/CV-ATS-M-Gusti-Arya-Priandana.pdf"
              download="CV_ATS_M_Gusti_Arya_Priandana.pdf"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neon-green hover:bg-neon-hover text-slate-950 font-bold font-poppins flex items-center justify-center gap-2 shadow-lg shadow-neon-green/10 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <LuDownload size={18} />
              Download CV
            </a>
            <a
              href="#feedback"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 font-semibold font-poppins hover:border-neon-green hover:text-neon-green transition-all duration-300 text-center"
            >
              Kirim Support & Rating
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center md:justify-start items-center gap-5"
          >
            <span className="text-xs font-ibm-plex-mono text-slate-500 uppercase tracking-widest mr-2">Follow Me:</span>
            {[
              { icon: LuGithub, href: "https://github.com/gustiaryapri", label: "Github", color: "blue" },
              { icon: LuInstagram, href: "https://instagram.com/gustiaryapri", label: "Instagram", color: "orange" },
              { icon: LuFacebook, href: "https://facebook.com/gustiaryapriandana31", label: "Facebook", color: "blue" },
              { icon: LuTwitter, href: "https://twitter.com/gustiaryapri", label: "Twitter", color: "orange" },
            ].map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.label}
                className={`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-450 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  soc.color === "blue"
                    ? "hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)]"
                    : "hover:text-[var(--accent)] hover:border-[var(--accent)]"
                }`}
              >
                <soc.icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Profile Image + Orbit Animations */}
        <div className="md:col-span-5 flex justify-center items-center order-1 md:order-2">
          <div className="relative w-[250px] h-[250px] xs:w-[280px] xs:h-[280px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] aspect-square shrink-0">
            {/* Pulsing Backglow */}
            <div className="absolute inset-4 rounded-full bg-neon-green/10 filter blur-xl animate-pulse-slow" />

            {/* Profile Frame & Avatar */}
            <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-slate-850 p-2 bg-slate-900 flex justify-center items-center">
              <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-800">
                <Image
                  src="/foto-profil.jpg"
                  alt="M. Gusti Arya Priandana"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  priority
                  className="object-cover object-top scale-100 hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>

            {/* Outer Orbit Line 1 */}
            <motion.svg
              className="absolute inset-0 w-full h-full animate-orbit-slow"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="var(--orbit-outer-color)"
                strokeWidth="0.75"
                strokeDasharray="8 6 12 8"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle cx="96" cy="50" r="2.5" fill="var(--orbit-outer-color)" />
            </motion.svg>

            {/* Inner Orbit Line 2 */}
            <motion.svg
              className="absolute inset-0 w-full h-full animate-orbit-reverse"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--orbit-inner-color)"
                strokeWidth="0.5"
                strokeDasharray="2 10 4 8"
                strokeLinecap="round"
                opacity="0.5"
              />
              <circle cx="10" cy="50" r="1.5" fill="var(--orbit-inner-color)" />
            </motion.svg>
          </div>
        </div>

      </div>
    </section>
  );
}
