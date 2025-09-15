/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // everything inside src
    "./*.{js,ts,jsx,tsx}"          // also files in the project root, just in case
  ],
  theme: { extend: {} },
  plugins: [],
};
