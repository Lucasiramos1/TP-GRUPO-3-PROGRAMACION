/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Consulir
        primary: "#003091",
        secondary: "#006EC3",
        tertiary: "#0CAFDF",
        accent: "#0CAFDF",
        neutral: "#222222",

        // Contenedores de marca
        "primary-container": "#EAF0FF",
        "secondary-container": "#EAF6FF",
        "tertiary-container": "#E7F9FD",

        // Variantes fijas de marca
        "primary-fixed": "#DCE8FF",
        "primary-fixed-dim": "#B9D1FF",
        "secondary-fixed": "#D8F0FF",
        "secondary-fixed-dim": "#A9DFFF",
        "tertiary-fixed": "#D8F7FC",
        "tertiary-fixed-dim": "#A8EAF5",

        // Textos sobre colores de marca
        "on-primary": "#FFFFFF",
        "on-secondary": "#FFFFFF",
        "on-tertiary": "#FFFFFF",

        "on-primary-container": "#001B52",
        "on-secondary-container": "#003B66",
        "on-tertiary-container": "#034452",

        "on-primary-fixed": "#001B52",
        "on-primary-fixed-variant": "#00266F",
        "on-secondary-fixed": "#003B66",
        "on-secondary-fixed-variant": "#00548F",
        "on-tertiary-fixed": "#034452",
        "on-tertiary-fixed-variant": "#066172",

        // Fondos y superficies
        background: "#F6F8FB",
        surface: "#FFFFFF",
        "surface-bright": "#FFFFFF",
        "surface-dim": "#E5EAF0",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F6F8FB",
        "surface-container": "#EEF3F8",
        "surface-container-high": "#E6EDF5",
        "surface-container-highest": "#DDE7F0",
        "surface-variant": "#E6EDF5",
        "surface-tint": "#003091",

        // Textos generales
        "on-background": "#222222",
        "on-surface": "#222222",
        "on-surface-variant": "#4F5B66",

        // Bordes
        outline: "#6B7785",
        "outline-variant": "#C6D1DC",

        // Colores inversos
        "inverse-surface": "#222222",
        "inverse-on-surface": "#FFFFFF",
        "inverse-primary": "#0CAFDF",

        // Estados de error
        error: "#BA1A1A",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",

        // Estados de éxito
        success: "#15803D",
        "on-success": "#FFFFFF",
        "success-container": "#DCFCE7",
        "on-success-container": "#166534",

        // Estados de advertencia
        warning: "#F59E0B",
        "on-warning": "#222222",
        "warning-container": "#FEF3C7",
        "on-warning-container": "#92400E",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        "margin-desktop": "40px",
        xl: "32px",
        md: "16px",
        "margin-mobile": "16px",
        gutter: "24px",
        xs: "4px",
        sm: "8px",
        "2xl": "48px",
        unit: "4px",
        lg: "24px",
        "3xl": "64px",
      },
      fontFamily: {
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display-lg": ["Hanken Grotesk", "sans-serif"],
      },
      fontSize: {
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "label-md": [
          "14px",
          {
            lineHeight: "16px",
            letterSpacing: "0.05em",
            fontWeight: "500",
          },
        ],
        "body-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
        "body-lg": [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "400",
          },
        ],
        "label-sm": [
          "12px",
          {
            lineHeight: "14px",
            letterSpacing: "0.05em",
            fontWeight: "500",
          },
        ],
        "headline-md": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "600",
          },
        ],
        "headline-lg-mobile": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-sm": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
      },
    },
  },
  plugins: [],
};