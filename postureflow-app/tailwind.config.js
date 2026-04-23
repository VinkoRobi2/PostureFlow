/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: "#0F172A",
          "bg-alt": "#1E293B",
          card: "rgba(255,255,255,0.04)",
          "card-muted": "rgba(203,213,225,0.07)",
          glass: "rgba(255,255,255,0.03)",
          border: "rgba(203,213,225,0.12)",
          accent: "#5EEAD4",
          "accent-strong": "#99F6E4",
          text: "#CBD5E1",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      backdropBlur: {
        zen: "20px",
      },
      boxShadow: {
        "zen-glow": "0px 24px 48px rgba(94,234,212,0.12)",
      },
    },
  },
  plugins: [],
};
