import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        petal: '#F7DEE6',
        rose: '#E8A9C0',
        warda: '#C75B8A',
        profond: '#7A2E4E',
        ink: '#2B1B22',
        sand: '#FBF6F2',
        gold: '#C9A24B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(122,46,78,0.25)',
        card: '0 4px 24px -8px rgba(122,46,78,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadein: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        fadein: 'fadein 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
