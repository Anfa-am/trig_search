import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      screens: {
        'smaller': {'max': '1000px'},
      },
      backgroundColor: {
        'main': '#101217',
        'accent': '#3F4454'
      },
      borderRadius: {
        'max': '25px',
      },
    },
  },
  plugins: [],
} satisfies Config;
