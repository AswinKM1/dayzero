/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#09090b", // zinc-950
                primary: {
                    DEFAULT: "#6366f1", // indigo-500
                    muted: "#818cf8",   // indigo-400 (lighter/muted feel on dark bg)
                },
            },
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            },
            letterSpacing: {
                DEFAULT: "-0.02em", // Tight tracking by default
                tight: "-0.04em",
            },
            backdropBlur: {
                xl: "24px",
            }
        },
    },
    plugins: [],
}
