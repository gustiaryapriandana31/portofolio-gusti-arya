/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--white)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-dark": "var(--accent-dark)",
        slate: {
          950: "var(--slate-950)",
          900: "var(--slate-900)",
          850: "var(--slate-850)",
          800: "var(--slate-800)",
          700: "var(--slate-700)",
          600: "var(--slate-600)",
          500: "var(--slate-500)",
          400: "var(--slate-400)",
          300: "var(--slate-300)",
        },
        neon: {
          green: "var(--accent)",
          hover: "var(--accent-hover)",
          dark: "var(--accent-dark)",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        audiowide: ["var(--font-audiowide)", "sans-serif"],
        neue: ["var(--font-bebas-neue)", "sans-serif"],
        "ibm-plex-mono": ["var(--font-ibm-plex-mono)", "monospace"],
      },
      animation: {
        "orbit-slow": "orbit 30s linear infinite",
        "orbit-reverse": "orbit-rev 40s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};

