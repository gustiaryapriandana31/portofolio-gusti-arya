import { LuGithub, LuInstagram, LuFacebook, LuTwitter, LuMail, LuPhone, LuMapPin, LuArrowUp } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-16 relative overflow-hidden">
      {/* Background neon dot */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-neon-green/5 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Call to action & footer grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#home" className="inline-flex items-center gap-2 group">
              <span className="font-audiowide text-2xl tracking-wider text-white">
                AR<span className="text-neon-green">YA</span>
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green group-hover:animate-ping"></span>
            </a>
            <p className="text-slate-400 font-poppins text-sm leading-relaxed max-w-sm">
              Membangun aplikasi web interaktif, responsif, dan bernilai guna menggunakan framework modern. Mari berkolaborasi menciptakan teknologi yang berdampak!
            </p>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-poppins font-bold text-white text-sm uppercase tracking-wider">
              Hubungi Saya
            </h4>
            <ul className="space-y-3 font-poppins text-sm text-slate-450">
              <li className="flex items-center gap-3">
                <LuMapPin size={16} className="text-neon-green shrink-0" />
                <span>Indralaya, Ogan Ilir, Sumatera Selatan</span>
              </li>
              <li className="flex items-center gap-3 hover:text-neon-green transition-colors">
                <LuMail size={16} className="text-neon-green shrink-0" />
                <a href="mailto:gustiaryapriandana@gmail.com">gustiaryapriandana@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 hover:text-neon-green transition-colors">
                <LuPhone size={16} className="text-neon-green shrink-0" />
                <a href="https://wa.me/6282281963857" target="_blank" rel="noopener noreferrer">0822-8196-3857</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-poppins font-bold text-white text-sm uppercase tracking-wider">
              Social Media
            </h4>
            <div className="flex items-center gap-3">
              {[
                { icon: LuGithub, href: "https://github.com/gustiaryapri", label: "Github" },
                { icon: LuInstagram, href: "https://instagram.com/gustiaryapri", label: "Instagram" },
                { icon: LuFacebook, href: "https://facebook.com/gustiaryapriandana31", label: "Facebook" },
                { icon: LuTwitter, href: "https://twitter.com/gustiaryapri", label: "Twitter" },
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-450 hover:text-neon-green hover:border-neon-green flex items-center justify-center transition-all duration-300"
                >
                  <soc.icon size={16} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-ibm-plex-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Portofolio Arya. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with Next.js & Supabase</span>
            <a
              href="#home"
              className="w-8 h-8 rounded bg-slate-900 border border-slate-850 hover:border-neon-green text-slate-450 hover:text-neon-green flex items-center justify-center transition-all duration-300 shadow-md"
              aria-label="Back to top"
            >
              <LuArrowUp size={14} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
