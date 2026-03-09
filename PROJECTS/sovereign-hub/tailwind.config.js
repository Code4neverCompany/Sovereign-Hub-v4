/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        michroma: ['Michroma', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        gold: '#FFD700',
        violet: '#A855F7',
        obsidian: '#020105',
      },
    },
  },
  plugins: [],
}
