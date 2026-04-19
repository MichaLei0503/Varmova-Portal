import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Varmova CI — Quelle: CD Manual 2026
        night: {
          DEFAULT: "#05070D",
          foreground: "#F5F5F5",
        },
        copper: {
          DEFAULT: "#E8A260",
          foreground: "#05070D",
        },
        // Alias: historischer "brand"-Token zeigt auf die Akzentfarbe Copper.
        brand: {
          DEFAULT: "#E8A260",
          foreground: "#05070D",
          soft: "#FBE9D4",
        },
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 30px rgba(5, 7, 13, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
