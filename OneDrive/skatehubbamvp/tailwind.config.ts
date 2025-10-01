import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hubba: { orange: "#ff6600", green: "#228B22", black: "#000000" }
      },
      backgroundImage: {
        hubbaWall: "url('/hubbagraffwall.png')",
        hubbaShop: "url('/shop background.png')",
        hubbaProfile: "url('/profile background.png')"
      }
    }
  },
  plugins: []
};
export default config;