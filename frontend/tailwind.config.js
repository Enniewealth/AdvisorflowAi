/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          900: "#0f2a4a",
        },
      },
      boxShadow: {
        card: "0 16px 40px rgba(15, 42, 74, 0.08)",
      },
    },
  },
  plugins: [],
};
