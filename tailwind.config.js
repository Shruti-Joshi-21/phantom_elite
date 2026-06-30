/** @type {import('tailwindcss').Config} */

// NOTE: Tailwind v4 reads tokens from app/globals.css @theme block.
// This file documents the same semantic palette for IDE tooling and future v3 compatibility.
const config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        heat: {
          cool:     '#2563EB',
          mild:     '#38BDF8',
          moderate: '#FACC15',
          high:     '#FB923C',
          severe:   '#DC2626',
        },
        action: {
          teal: '#0D9488',
        },
        budget: {
          indigo: '#4F46E5',
        },
        tradeoff: {
          amber: '#D97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
