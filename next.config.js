const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ottimizzazione immagini — su Vercel usa Image Optimization nativa
    images: {
        formats: ['image/avif', 'image/webp'],
        // Aggiungere qui domini esterni quando si integra Cloudinary/Sanity:
        // remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    },

    // Headers di sicurezza (vercel.json ne aggiunge altri in produzione)
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
