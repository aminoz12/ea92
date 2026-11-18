/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fcfcfc',
          400: '#fafafa',
          500: '#ffffff',
          600: '#f5f5f5',
          700: '#e5e5e5',
          800: '#d4d4d4',
          900: '#a3a3a3',
        },
        // Brand red — sampled from the logo (deep crimson, not Tailwind's red).
        secondary: {
          50: '#fdf3f3',
          100: '#fbe4e5',
          200: '#f7cdcf',
          300: '#f0a5a8',
          400: '#e56d72',
          500: '#d93a41',
          600: '#c8151d',
          700: '#a81018',
          800: '#8b1117',
          900: '#741418',
        },
        // Warm neutrals (ink + stone) instead of the default blue-tinted gray.
        gray: {
          50: '#f7f7f5',
          100: '#efefec',
          200: '#e3e3df',
          300: '#cdcdc7',
          400: '#9d9d96',
          500: '#70706a',
          600: '#52524d',
          700: '#3d3d39',
          800: '#262624',
          900: '#171716',
          950: '#0c0c0b',
        },
        // Single accent: signal yellow, for promos and discounts only.
        signal: {
          50: '#fffbea',
          100: '#fff3c2',
          300: '#ffdc5c',
          400: '#ffcf2e',
          500: '#ffc20a',
          600: '#e0a800',
          700: '#b38600',
        },
        accent: {
          500: '#ef4444',
        },
        success: {
          500: '#10b981',
        },
      },
      fontFamily: {
        // Loaded with next/font in src/app/layout.tsx
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
      },
      ringColor: {
        'primary-500': '#ffffff',
        'secondary-500': '#ef4444',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
