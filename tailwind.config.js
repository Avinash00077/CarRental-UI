/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", // Include the Vite root HTML file
      "./src/**/*.{js,jsx,ts,tsx}", // Include all React components
    ],
    theme: {
      extend: {}, // Extend Tailwind's default theme if needed
    },
    plugins: [], // Add plugins here (if any)
  };
  