// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const nextConfig = {
    webpack: (config) => {
        config.infrastructureLogging = { level: 'error' };
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'static/fonts/[hash][ext][query]'
            }
        });
        return config;
    },
    images: {
        domains: ['res.cloudinary.com'],
        minimumCacheTTL: 31536000, // 1 year in seconds
        deviceSizes: [375, 640, 828, 1080, 1200],
        imageSizes: [16, 32, 64, 96, 128],
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
    },
    // Added additional cache headers for Cloudinary images
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);