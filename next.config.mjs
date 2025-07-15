/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'images.unsplash.com',
            'localhost',
            'via.placeholder.com'
        ],
    },
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                key: 'Content-Security-Policy',
                value: [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
                    "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://static.elfsight.com",
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: https: http:",
                    "frame-src 'self' https://www.google.com/recaptcha/ https://app.thinkstack.ai",
                    "connect-src 'self' https://www.google.com/recaptcha/"
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