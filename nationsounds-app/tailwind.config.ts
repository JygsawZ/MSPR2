import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#3B82F6",    // blue-500
          secondary: "#6B7280",  // gray-500
          accent: "#10B981",     // emerald-500
          neutral: "#1F2937",    // gray-800
          "base-100": "#FFFFFF", // white
          "base-200": "#F3F4F6", // gray-100
          "base-300": "#E5E7EB", // gray-200
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3B82F6",
          secondary: "#6B7280",
          accent: "#10B981",
          neutral: "#1F2937",
          "base-100": "#1F2937", // gray-800
          "base-200": "#111827", // gray-900
          "base-300": "#0F172A", // slate-900
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
  plugins: [
    daisyui,
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
