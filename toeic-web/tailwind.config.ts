import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-bg)",
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
        },
      },
      backgroundImage: {
        "gradient-hero-light": "linear-gradient(135deg, var(--gradient-hero-start), var(--gradient-hero-end))",
        "hero-to-br": "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
        "hero-dark": "linear-gradient(135deg, #dc2626, #be185d)",
      },
    },
  },
  plugins: [],
};

export default config;
