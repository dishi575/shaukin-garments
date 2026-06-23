/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "sg-cream":      "#FAF7F2",
        "sg-ink":        "#1A1612",
        "sg-muted":      "#7A7068",
        "sg-border":     "#E4DDD4",
        "sg-surface":    "#FFFFFF",
        "sg-indigo":     "#3D3B8E",
        "sg-indigo-lt":  "#EEEDF8",
        "sg-saffron":    "#D4691E",
        "sg-saffron-lt": "#FDF0E6",
        "sg-green":      "#1E6B4A",
        "sg-green-lt":   "#E6F5EE",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
