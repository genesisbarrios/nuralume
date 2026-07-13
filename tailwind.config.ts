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
          "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
        "ruled-paper":
          "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(59,130,246,0.15) 28px)",
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
          primary: "#3B82F6",
          "primary-content": "#F0F7FF",
          secondary: "#6366F1",
          "secondary-content": "#F0F0FF",
          accent: "#38BDF8",
          "accent-content": "#062634",
          neutral: "#1E293B",
          "neutral-content": "#E7ECF3",
          "base-100": "#FFFFFF",
          "base-200": "#F1F5FB",
          "base-300": "#DCE6F5",
          "base-content": "#1E293B",
          info: "#38BDF8",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
export default config;
