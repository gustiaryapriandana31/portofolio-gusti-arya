import { Poppins, Audiowide, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-audiowide",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "Portofolio Arya | M. Gusti Arya Priandana, S.Kom",
  description: "Web Developer / Software Engineer portfolio website built using Next.js, React, Supabase, and Prisma.",
  keywords: ["M. Gusti Arya Priandana", "Arya", "Portofolio", "Web Developer", "Software Engineer", "React", "NextJS", "Supabase", "Prisma"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'dark';
                  document.documentElement.classList.add(theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${audiowide.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} antialiased text-foreground bg-background min-h-screen relative`}
      >
        {/* Decorative background blobs */}
        <div className="bg-blobs">
          <div className="bg-blob-1"></div>
          <div className="bg-blob-2"></div>
          <div className="bg-blob-3"></div>
        </div>
        {children}
      </body>
    </html>
  );
}

