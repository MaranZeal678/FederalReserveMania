/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
            },
            colors: {
                terminal: {
                    green: '#00ff41',
                    dim: '#003b00',
                    bright: '#00ff00',
                }
            }
        },
    },
    plugins: [],
}
