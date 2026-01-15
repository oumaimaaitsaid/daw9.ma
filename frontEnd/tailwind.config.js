/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "primary": "#D4AF37",
        "primary-hover": "#C5A028",
        "secondary": "#221610",
        "background-light": "#FAF9F6",
        "background-dark": "#1A1412",
        "accent-soft": "#F1EAD7",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
      },
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",
        "DEFAULT": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2.5rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}
