/** @type {import('tailwindcss').Config} */
      export default {
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {
            colors: {
              'brand-primary': '#6D28D9',
              'brand-secondary': '#EC4899',
            }
          },
        },
        plugins: [],
      };