import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petal: "#FBF2EF",
        brume: "#EDD5CD",
        warda: "#C17A82",
        profond: "#8A3D52",
        champagne: "#C4993A",
        ordoux: "#EAD9A6",
        brun: "#3C2128",
        gris: "#8A6E72",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        arabic: ["Cairo", "Geeza Pro", "Segoe UI Arabic", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(60,33,40,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
