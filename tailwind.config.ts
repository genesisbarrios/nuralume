import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        handwritten: ["var(--font-handwritten)"],
      },
      backgroundImage: {
        "notebook-cover":
          "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08) 0, transparent 12%), " +
          "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.06) 0, transparent 10%), " +
          "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 0, transparent 14%), " +
          "radial-gradient(circle at 90% 70%, rgba(255,255,255,0.07) 0, transparent 11%), " +
          "radial-gradient(circle at 60% 90%, rgba(255,255,255,0.05) 0, transparent 13%), " +
          "radial-gradient(circle at 10% 85%, rgba(255,255,255,0.06) 0, transparent 12%), " +
          "linear-gradient(135deg, #4C3A8F 0%, #241C30 100%)",
        "ruled-paper":
          "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(122,92,168,0.16) 28px)",
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        nuralume: {
          primary: "#6C4FB6",
          "primary-content": "#FBF6EF",
          secondary: "#4A3654",
          "secondary-content": "#F2E8DC",
          accent: "#F2CDA6",
          "accent-content": "#2A1F3D",
          neutral: "#2A2530",
          "neutral-content": "#F2E8DC",
          "base-100": "#FDFBF7",
          "base-200": "#F3ECE3",
          "base-300": "#E6D9C8",
          "base-content": "#2A2233",
          info: "#8F739D",
          success: "#7FA88A",
          warning: "#D9A15B",
          error: "#C4685F",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
export default config;
