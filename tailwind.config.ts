import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        aura: {
          50: "#f5f7ff",
          100: "#ebf0fe",
          200: "#d6e0fd",
          300: "#b3c6fb",
          400: "#88a3f7",
          500: "#637cf2",
          600: "#485be8",
          700: "#3847d0",
          800: "#2f3aa8",
          900: "#2b3485",
          950: "#1b1f51",
        },
        companion: {
          violet: "#8b5cf6",
          rose: "#f43f5e",
          amber: "#f59e0b",
          emerald: "#10b981",
          cyan: "#06b6d4",
          indigo: "#6366f1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            opacity: "0.4",
            transform: "scale(1)",
            filter: "blur(20px)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.1)",
            filter: "blur(28px)",
          },
        },
        wave: {
          "0%, 100%": { height: "6px" },
          "50%": { height: "28px" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "wave-1": "wave 1.2s ease-in-out infinite",
        "wave-2": "wave 1.2s ease-in-out 0.2s infinite",
        "wave-3": "wave 1.2s ease-in-out 0.4s infinite",
        "wave-4": "wave 1.2s ease-in-out 0.6s infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
