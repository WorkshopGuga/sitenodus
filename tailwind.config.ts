import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080b12",
        surface: "#0b101b",
        accent: "#5a83ff",
        "accent-deep": "#3a5fd6",
        paper: "#eceeea",
      },
      fontFamily: { sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"] },
      maxWidth: { content: "1180px" },
    },
  },
  plugins: [],
} satisfies Config;
