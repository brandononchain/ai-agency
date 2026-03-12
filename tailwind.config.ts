import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        brutal: {
          black: "#0a0a0a",
          white: "#fafafa",
          yellow: "#FAFF00",
          red: "#FF3333",
          blue: "#3344FF",
          green: "#00FF66",
          purple: "#AA33FF",
          orange: "#FF8800",
          pink: "#FF33AA",
          gray: "#888888",
        },
      },
      boxShadow: {
        brutal: "6px 6px 0 0 #0a0a0a",
        "brutal-sm": "4px 4px 0 0 #0a0a0a",
        "brutal-lg": "8px 8px 0 0 #0a0a0a",
        "brutal-hover": "2px 2px 0 0 #0a0a0a",
      },
    },
  },
  plugins: [],
};

export default config;
