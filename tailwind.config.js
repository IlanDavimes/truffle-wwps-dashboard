/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          'bg-soft': 'var(--brand-bg-soft)',
          text: 'var(--brand-text)',
          'text-muted': 'var(--brand-text-muted)',
          accent: 'var(--brand-accent)',
          'accent-strong': 'var(--brand-accent-strong)',
          pink: 'var(--brand-pink)',
          'hero-bg': 'var(--brand-hero-bg)',
        },
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
      },
    },
  },
  plugins: [],
}
