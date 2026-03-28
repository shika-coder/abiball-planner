import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f6f0e8",
        ink: "#1f2937",
        ember: "#c96f4a",
        wine: "#5f2f3d",
        pine: "#1f4f46",
        sand: "#e9dcc6"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(58, 43, 24, 0.12)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(201, 111, 74, 0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(31, 79, 70, 0.2), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
