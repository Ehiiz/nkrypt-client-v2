import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#B2F17E",
        secondary: "#5744B7",
        base: {
          one: "#2E3238",
          two: "#63626C",
          three: "#17161C",
        },
      },
      fontFamily: {
        carbonic: ["var(--font-carbonic)"],
        aeonik: ["var(--font-aeonik)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
