const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ottimizzazione immagini — su Vercel usa Image Optimization nativa
    images: {
        // Solo WebP: AVIF pesa ~20% in meno ma si codifica molto più lentamente
        // e la prima richiesta di ogni foto (gallerie, lightbox) resta vuota
        // per secondi. Cache di 7 giorni: per sostituire una foto usare un
        // nome file nuovo, altrimenti resta servita la versione in cache.
        formats: ['image/webp'],
        minimumCacheTTL: 604800,
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
