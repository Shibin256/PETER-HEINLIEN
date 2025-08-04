export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#266b7d",
          light: "#66a8b8", // custom lighter tint for ring
        },
      },
    },
  },
  plugins: [],
};
