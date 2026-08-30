import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "azul-noche":   "#0B1026",
        "blanco-lunar": "#F9F7F2",
        "ambar":        "#F5A623",
        "ambar-light":  "#FFD56B",
        "terracota":     "#C15B3A",
        "jade":          "#00A87F",
        "turquesa":      "#2EC4B6",
        "arena":         "#D9CBB8",
        "gris-pizarra": "#4A5568",
        "negro-suave":   "#121212",
        "oro-estelar":   "#FFD56B",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "'Cinzel Decorative'", "serif"],
        inter:  ["var(--font-inter)", "'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
