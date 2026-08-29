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
        drawer: "0 0 40px rgba(60,33,40,0.18)",
        card: "0 2px 12px rgba(60,33,40,0.08)",
        glow: "0 0 20px rgba(193,122,130,0.35)",
        "glow-lg": "0 0 40px rgba(193,122,130,0.3)",
        subtle: "0 1px 3px rgba(60,33,40,0.06)",
        elevated: "0 4px 20px -4px rgba(60,33,40,0.15), 0 1px 3px rgba(60,33,40,0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
