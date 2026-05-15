/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        warmSlate: "#2F353B",
        warmSlateDeep: "#262B30",
        terracotta: "#E2725B",
        cinnamon: "#D2691E",
        bone: "#F5F5F5",
        boneMuted: "#C8C8C8",
      },
      borderRadius: {
        premium: "12px",
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
    },
  },
  plugins: [],
};
