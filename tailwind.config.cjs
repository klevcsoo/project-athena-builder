/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                breathe: {
                    "0%, 100%": {transform: "scale(1)"},
                    "50%": {transform: "scale(1.1)"}
                }
            },
            animation: {
                breathe: "breathe 1s ease-in-out infinite"
            }
        },
    },
    plugins: [],
}
