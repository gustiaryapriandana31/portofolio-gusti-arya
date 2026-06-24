"use client";
import { motion } from "framer-motion";
import { LuUser, LuAward, LuBookOpen, LuHeart } from "react-icons/lu";

export default function About() {
  const cards = [
    {
      icon: LuUser,
      title: "Profil",
      description: "Sarjana Komputer (S.Kom) dengan hasrat mendalam pada rekayasa perangkat lunak dan pengembangan web.",
    },
    {
      icon: LuAward,
      title: "Spesialisasi",
      description: "Pengembangan front-end dan back-end dengan RBAC, relasi database kompleks, dan optimasi query.",
    },
    {
      icon: LuBookOpen,
      title: "Metodologi",
      description: "Pendekatan pemrograman terstruktur dan bersih untuk menghasilkan solusi web yang skalabel dan efisien.",
    },
    {
      icon: LuHeart,
      title: "Minat",
      description: "Menyukai tantangan memecahkan masalah logis (Catur, Rubik) dan senang berkolaborasi dalam tim.",
    },
  ];

  return (
    <section id="about" className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Tentang Saya</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            BIODATA & PROFIL SINGKAT
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        {/* Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Detailed Paragraph Text */}
          <div className="lg:col-span-6 space-y-6">
            <h4 className="text-xl md:text-2xl font-poppins font-semibold text-white">
              Halo, Saya Gusti Arya Priandana
            </h4>
            <p className="text-slate-400 font-poppins leading-relaxed">
              Saya adalah seorang lulusan Sistem Informasi (*Bachelor of Computer Science*) dari Universitas Sriwijaya dengan IPK **3.92/4.00**. Fokus keahlian saya terletak pada pengembangan sistem informasi manajemen dan website menggunakan kerangka kerja modern.
            </p>
            <p className="text-slate-400 font-poppins leading-relaxed">
              Saya berpengalaman membangun aplikasi berskala menengah secara end-to-end dengan menggunakan kombinasi Laravel (Livewire, Alpine.js) serta ekosistem ReactJS. Saya sangat menekankan performa kode, standarisasi API, keamanan akses berbasis peran (RBAC), serta integritas database.
            </p>
            <p className="text-slate-400 font-poppins leading-relaxed">
              Bagi saya, pemrograman bukan sekadar menulis baris kode, melainkan proses merancang arsitektur sistem yang terstruktur untuk menjawab kebutuhan bisnis nyata dan memberikan pengalaman pengguna (*user experience*) yang luar biasa.
            </p>
          </div>

          {/* Feature Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glow-card p-6 flex flex-col items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-neon-green">
                  <card.icon size={22} />
                </div>
                <div>
                  <h5 className="font-poppins font-semibold text-white text-base mb-2">
                    {card.title}
                  </h5>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
