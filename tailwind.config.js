/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Allineati alle CSS variables in app/[locale]/globals.css
                tufo: 'var(--tufo)',
                'mucco-pisano': 'var(--mucco-pisano)',
                'argilla-ferrosa': 'var(--argilla-ferrosa)',
                'sabbia-limonitica': 'var(--sabbia-limonitica)',
                olive: 'var(--olive)',
                'terra-nera': 'var(--terra-nera)',
                grano: 'var(--grano)',
                cielo: 'var(--cielo)',
                notte: 'var(--notte)',
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
                body: ['var(--font-inter)', 'Helvetica Neue', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
