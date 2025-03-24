/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // if using the app router
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["Inter", "ui-sans-serif", "system-ui"],
        },
        colors: {
          primary: "#2563eb", // blue-600
          secondary: "#f3f4f6", // gray-100
        },
        boxShadow: {
          card: "0 4px 6px rgba(0,0,0,0.05)",
        },
      },
    },
    plugins: [],
  };
  