const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding portfolio data...");

  // 1. Clear existing data
  await prisma.education.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.softSkill.deleteMany({});
  await prisma.hobby.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.project.deleteMany({});

  // 2. Seed Education
  const educationHistory = [
    {
      degree: "Sarjana Sistem Informasi (S.Kom)",
      institution: "Universitas Sriwijaya",
      period: "Agustus 2021 – Agustus 2025",
    },
    {
      degree: "Sekolah Menengah Atas - Jurusan IPA",
      institution: "SMAN 1 Indralaya Ogan Ilir",
      period: "2018 – 2021",
    },
  ];

  for (const edu of educationHistory) {
    await prisma.education.create({ data: edu });
  }
  console.log("Seeded Education.");

  // 3. Seed Experience
  const experiences = [
    {
      title: "Internship Web Developer",
      company: "Badan Pusat Statistik Ogan Ilir",
      period: "Desember 2025 – Sekarang",
      points: [
        "Mengembangkan 'PINDANG OI' (Portal Integrasi Data dan Informasi Penunjang) — sistem manajemen aktivitas karyawan BPS secara end-to-end menggunakan Laravel, Tailwind CSS, dan Alpine.js.",
        "Mengelola deployment sistem PINDANG OI serta memberikan dukungan teknis berkala kepada 40+ pegawai BPS Ogan Ilir untuk memastikan operasional harian berjalan mulus.",
        "Membangun web tracking 'MANGCEK OI' (Mitra Bantu Ground Check) yang digunakan oleh mitra lapangan untuk memperbarui data 29.000+ entitas bisnis dalam persiapan Sensus Ekonomi 2026.",
        "Mengotomatiskan unggahan data dalam skala besar dari portal MANGCEK OI ke aplikasi internal BPS Nasional menggunakan script Python, menghemat waktu entri data secara signifikan.",
        "Berpartisipasi dalam Pelatihan Ground Check PLMN dan membantu melatih personel PLN BillMan dalam pengumpulan data lapangan.",
      ],
    },
    {
      title: "Developer - Proyek KMS Lab Komputer",
      company: "Skripsi / Tugas Akhir Universitas Sriwijaya",
      period: "Oktober 2024 – Juni 2025",
      points: [
        "Merancang dan mengembangkan Knowledge Management System (KMS) Laboratorium Komputer untuk memfasilitasi sharing knowledge antar mahasiswa dan asisten laboratorium.",
        "Membangun antarmuka front-end interaktif menggunakan TailwindCSS, Laravel Blade, dan Livewire.",
        "Mengimplementasikan backend terstruktur dengan Laravel (Jetstream & Spatie RBAC) serta mengintegrasikan mesin pencari Elasticsearch untuk hasil pencarian dokumen yang instan dan akurat.",
      ],
    },
    {
      title: "AWS Cloud Data Engineer & Gen AI Track",
      company: "Kampus Merdeka x RevoU Cohort",
      period: "Februari 2024 – Juni 2024",
      points: [
        "Mempelajari komputasi awan, infrastruktur AWS, dan pengolahan data terdistribusi (Data Engineering).",
        "Menyelesaikan proyek analisis data berskala menengah menggunakan query SQL kompleks dan Excel (Pivot tables & Visualisasi).",
        "Menyelesaikan Capstone Project tingkat lanjut dengan membangun aplikasi asisten pintar (chatbot) berbasis Amazon Q.",
      ],
    },
    {
      title: "Staff Data & Informasi Intern",
      company: "Bawaslu Republik Indonesia (Jakarta)",
      period: "Desember 2023 – Januari 2024",
      points: [
        "Magang di departemen Pusat Data dan Informasi (Pusdatin) Bawaslu RI.",
        "Berkontribusi dalam migrasi dan deployment subdomain web PPID untuk Bawaslu tingkat Provinsi dan Kabupaten/Kota se-Indonesia.",
        "Melakukan evaluasi sistem layanan informasi E-PPID Bawaslu RI menggunakan metode EUCS (End-User Computing Satisfaction) untuk laporan kenyamanan pengguna.",
        "Membantu jalannya Rapat Teknis Pengelolaan Website Utama Bawaslu Kabupaten/Kota Hasil Unifikasi Regional.",
      ],
    },
    {
      title: "Project-Based Virtual Intern",
      company: "Rakamin Academy x Investree (Fullstack Developer)",
      period: "Juni 2023 – Juli 2023",
      points: [
        "Membuat RESTful API studi kasus blog posting menggunakan framework Laravel dan MySQL.",
        "Mengimplementasikan unit testing terstandarisasi menggunakan PHPUnit di Laravel.",
        "Menerapkan arsitektur kode bersih (clean code) mengikuti PHP standards (PSR-12).",
        "Mengintegrasikan autentikasi JWT token untuk keamanan API.",
      ],
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log("Seeded Experience.");

  // 4. Seed Skills
  const hardSkills = [
    { name: "HTML", level: 95, label: "Mahir (Expert)", category: "hard" },
    { name: "CSS", level: 90, label: "Mahir (Expert)", category: "hard" },
    { name: "Javascript", level: 90, label: "Mahir (Expert)", category: "hard" },
    { name: "Laravel", level: 92, label: "Mahir (Expert)", category: "hard" },
    { name: "ReactJS", level: 75, label: "Menengah (Intermediate)", category: "hard" },
    { name: "NextJS", level: 60, label: "Pemula (Beginner)", category: "hard" },
    { name: "TailwindCSS", level: 85, label: "Menengah (Intermediate)", category: "hard" },
    { name: "MySQL / SQL", level: 80, label: "Menengah (Intermediate)", category: "hard" },
    { name: "Python", level: 55, label: "Pemula (Beginner)", category: "hard" },
    { name: "Elasticsearch", level: 50, label: "Pemula (Beginner)", category: "hard" },
    { name: "Java", level: 70, label: "Menengah (Intermediate)", category: "hard" },
    { name: "RESTful API", level: 88, label: "Mahir (Expert)", category: "hard" },
    { name: "Bahasa Indonesia", level: 100, label: "Native", category: "language" },
    { name: "English", level: 65, label: "Intermediate", category: "language" },
  ];

  for (const skill of hardSkills) {
    await prisma.skill.create({ data: skill });
  }

  const softSkills = [
    "Problem Solving",
    "Analisis Data",
    "Kerja Tim (Teamwork)",
    "Komunikasi Teknis",
    "Adaptabilitas Tinggi",
    "Manajemen Waktu",
  ];

  for (const name of softSkills) {
    await prisma.softSkill.create({ data: { name } });
  }

  const hobbies = [
    { name: "Catur (Strategic Thinking)", icon: "♟️" },
    { name: "Rubik & Puzzle", icon: "🧩" },
    { name: "Bulutangkis (Badminton)", icon: "🏸" },
  ];

  for (const hobby of hobbies) {
    await prisma.hobby.create({ data: hobby });
  }
  console.log("Seeded Skills, SoftSkills, and Hobbies.");

  // 5. Seed Certifications
  const certificates = [
    {
      title: "Sertifikat Kompetensi Pengembang Perangkat Lunak dan Pemrograman",
      issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
      period: "Januari 2024 – Januari 2027",
      link: "#",
    },
    {
      title: "Belajar Dasar Pemrograman Javascript",
      issuer: "Dicoding Indonesia",
      period: "September 2023 – September 2026",
      link: "#",
    },
    {
      title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
      issuer: "Dicoding Indonesia",
      period: "Juli 2023 – Juli 2026",
      link: "#",
    },
    {
      title: "Sertifikat Kelas Belajar Dasar Node.js dan NPM",
      issuer: "CODEPOLITAN",
      period: "Oktober 2024 – Oktober 2027",
      link: "#",
    },
    {
      title: "Sertifikat Kelas Belajar Javascript DOM",
      issuer: "CODEPOLITAN",
      period: "Mei 2024 – Mei 2027",
      link: "#",
    },
    {
      title: "Sertifikat Kelas Belajar Javascript Asynchronous",
      issuer: "CODEPOLITAN",
      period: "Mei 2024 – Mei 2027",
      link: "#",
    },
    {
      title: "Memulai Pemrograman Dengan Java",
      issuer: "Dicoding Indonesia",
      period: "Juni 2023 – Juni 2026",
      link: "#",
    },
    {
      title: "Memulai Pemrograman Dengan Kotlin",
      issuer: "Dicoding Indonesia",
      period: "Agustus 2023 – Agustus 2026",
      link: "#",
    },
    {
      title: "Belajar Membuat Aplikasi Android untuk Pemula",
      issuer: "Dicoding Indonesia",
      period: "Agustus 2023 – Agustus 2026",
      link: "#",
    },
    {
      title: "Responsive Web Design Certification",
      issuer: "freeCodeCamp",
      period: "Desember 2022",
      link: "#",
    },
    {
      title: "CSS Certificate",
      issuer: "HackerRank",
      period: "Juni 2023",
      link: "#",
    },
    {
      title: "Java Basic Certificate",
      issuer: "HackerRank",
      period: "Oktober 2022",
      link: "#",
    },
  ];

  for (const cert of certificates) {
    await prisma.certification.create({ data: cert });
  }

  const achievements = [
    {
      title: "Juara 1 Web Design Competition",
      event: "IT Festival MI Polsri",
      period: "Oktober 2024",
      description: "Memenangkan kompetisi desain web bertema 'Building a Web for Content Creators' dengan merancang situs branding untuk bintang tamu Shandy Luo.",
    },
    {
      title: "Juara 1 Web Design Code Competition",
      event: "IT Festival HMIF Fasilkom Unsri",
      period: "April 2024",
      description: "Meraih juara pertama dengan merancang situs bertema eksplorasi luar angkasa / galaksi.",
    },
    {
      title: "Juara 1 Lomba Inovasi Teknologi Tepat Guna",
      event: "Dinas Perikanan Kota Palembang",
      period: "Oktober 2024",
      description: "Meraih juara pertama bersama tim FEECOS (Feed Control Assistant) untuk purwarupa website pemantau pemberian pakan ikan otomatis.",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }
  console.log("Seeded Certifications and Achievements.");

  // 6. Seed Projects
  const demoProjects = [
    {
      name: "PINDANG OI (Portal Integrasi Data dan Informasi Penunjang)",
      duration: "Desember 2025 - Sekarang",
      description: "Sistem Manajemen Aktivitas Karyawan terintegrasi berskala menengah. Membantu staf BPS mencatat, memvalidasi, dan mengintegrasikan aktivitas kerja harian dengan dasbor analitik real-time.",
      link: "https://github.com/gustiaryapri/pindang-oi",
      purpose: "Memperlancar pelaporan kinerja harian dan integrasi data di lingkungan BPS Ogan Ilir.",
      technologies: ["Laravel", "TailwindCSS", "Alpine.js", "MySQL"],
      images: ["/foto-profil.jpg"] // Array of images
    },
    {
      name: "MANGCEK OI (Mitra Bantu Ground Check)",
      duration: "Desember 2025",
      description: "Aplikasi mobile tracking berbasis web yang memudahkan mitra lapangan BPS melakukan verifikasi data fisik 29.000+ entitas bisnis di lapangan dengan koordinat GPS presisi tinggi.",
      link: "https://github.com/gustiaryapri/mangcek-oi",
      purpose: "Persiapan pemetaan basis data entitas bisnis Sensus Ekonomi 2026.",
      technologies: ["Laravel", "Leaflet.js", "TailwindCSS", "PostgreSQL"],
      images: ["/foto-profil.jpg"] // Array of images
    },
    {
      name: "Knowledge Management System (KMS) Lab Komputer",
      duration: "Oktober 2024 - Juni 2025",
      description: "Sistem manajemen pengetahuan berbagi dokumen, modul praktikum, dan tutorial asisten laboratorium. Terintegrasi dengan mesin pencari Elasticsearch untuk pencarian instan.",
      link: "https://github.com/gustiaryapri/kms-fasilkom",
      purpose: "Skripsi / Tugas Akhir Universitas Sriwijaya.",
      technologies: ["Laravel", "Livewire", "Elasticsearch", "TailwindCSS", "MySQL"],
      images: ["/foto-profil.jpg"] // Array of images
    }
  ];

  for (const proj of demoProjects) {
    await prisma.project.create({ data: proj });
  }
  console.log("Seeded Projects.");

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
