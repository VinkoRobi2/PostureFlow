/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: "#020617",
          "bg-alt": "#09090B",
          card: "#0F172A",
          "card-muted": "#111827",
          glass: "rgba(15,23,42,0.52)",
          border: "rgba(52,211,153,0.10)",
          accent: "#10B981",
          "accent-strong": "#34D399",
          text: "#F4F4F5",
          muted: "#A1A1AA",
          subtle: "#71717A",
        },
      },
      boxShadow: {
        "zen-glow": "0px 12px 28px rgba(16,185,129,0.16)",
      },
    },
  },
  plugins: [],
};
