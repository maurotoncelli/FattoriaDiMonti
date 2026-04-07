const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ottimizzazione immagini — Netlify gestisce tramite il plugin Next.js
    images: {
        formats: ['image/avif', 'image/webp'],
        // Aggiungere qui domini esterni quando si integra Cloudinary/Sanity:
        // remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    },

    // Headers di sicurezza (Netlify aggiunge i propri via netlify.toml,
    // questi si applicano in sviluppo locale e altri hosting)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
        ];
    },

    webpack: (config) => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            use: ['raw-loader'],
        });
        return config;
    },
};

module.exports = withNextIntl(nextConfig);
