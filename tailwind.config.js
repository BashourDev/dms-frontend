const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      //old primary 8CC152
      // newer primary color 5ECD81
      // newest primary for sure 00c67f
      hpu: "#191950",
      primary: "#2E9CCA",
      dark: "#434A54",
      lightGray: "#AAB2BD",
      light: "#F5F7FA",
      danger: "#E9573F",
      success: "#28C71A",
      info: "#E4E904",
    },
    extend: {
      width: {
        128: "32rem",
      },
      height: {
        110: "28rem",
        128: "32rem",
      },
      // backgroundImage: {
      //   med: "opacity: 50, url('./assets/med.jpeg')",
      //   doctor: "url('./assets/doctor.jpg')",
      // },
    },
    fontFamily: {
      "droid-kufi": ["DroidArabicKufiRegular", "sans-serif"],
    },
  },
  plugins: [],
};
