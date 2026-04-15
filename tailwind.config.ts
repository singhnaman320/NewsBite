import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#f8f5ef",
        accent: "#c2410c",
        pine: "#184e3a",
        mist: "#dbe4dc"
      },
      boxShadow: {
        editorial: "0 18px 45px rgba(17, 24, 39, 0.14)"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        grain: "radial-gradient(circle at top left, rgba(194,65,12,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(24,78,58,0.1), transparent 32%)"
      }
    }
  },
  plugins: []
} satisfies Config;
