import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C1A17",
        paper: "#FBF9F4",
        rule: "#D8D2C4",
        accent: "#2F5D4E",
        accentSoft: "#E4ECE8",
        gold: "#B8893E",
        muted: "#6B6358",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        page: "8.5in",
      },
    },
  },
  plugins: [],
};

export default config;
