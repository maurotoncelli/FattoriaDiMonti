/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                tufo: '#ECE8DF',
                'mucco-pisano': '#4A2E1B',
                'argilla-ferrosa': '#B05C46',
                'sabbia-limonitica': '#D4A361',
                olive: '#6B7A65',
                'terra-nera': '#2B2420',
                grano: '#B4B886',
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
                body: ['var(--font-inter)', 'Helvetica Neue', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
