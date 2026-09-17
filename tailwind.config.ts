import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D1A",
        surface: "#1A1A2E",
        accent: "#5B9CF6",
        "accent-deep": "#1D4ED8",
        paper: "#FAF8F9",
      },
      fontFamily: { sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"] },
      maxWidth: { content: "1180px" },
    },
  },
  plugins: [],
} satisfies Config;
