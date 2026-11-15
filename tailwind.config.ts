import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f5f5f7",
        brand: "#D4AF37",
        "brand-dark": "#C5A059",
        mist: "#141519",
        gold: "#D4AF37",
        "gold-primary": "#D4AF37",
        "gold-secondary": "#C5A059",
        "gold-light": "#F3E5AB",
        "dark-bg": "#0A0A0C",
        "dark-card": "#141519",
        "dark-border": "#2A2D35",
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 55px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [forms],
};

export default config;
