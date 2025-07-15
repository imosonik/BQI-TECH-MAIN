/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'images.unsplash.com',
            'localhost',
            'via.placeholder.com',
            'app.thinkstack.ai'
        ],
    },
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                key: 'Content-Security-Policy',
                value: [
                    "default-src 'self' https://app.thinkstack.ai",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.thinkstack.ai https://app.thinkstack.ai/bot/thinkstackai-loader.min.js",
                    "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://static.elfsight.com https://app.thinkstack.ai https://app.thinkstack.ai/bot/thinkstackai-loader.min.js",
                    "style-src 'self' 'unsafe-inline' https://app.thinkstack.ai",
                    "img-src 'self' data: https: http: https://app.thinkstack.ai",
                    "frame-src 'self' https://www.google.com/recaptcha/ https://app.thinkstack.ai",
                    "connect-src 'self' https://www.google.com/recaptcha/ https://app.thinkstack.ai https://app.thinkstack.ai/bot/thinkstackai-loader.min.js"
                ].join('; ')
            },
            {
                key: 'X-Frame-Options',
                value: 'DENY'
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff'
            },
            {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin'
            }
            ]
        }]
    }
};

export default nextConfig;