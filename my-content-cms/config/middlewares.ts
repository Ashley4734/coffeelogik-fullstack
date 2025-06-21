export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://coffeelogik.com',
            'https://api.coffeelogik.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://coffeelogik.com',
            'https://api.coffeelogik.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: (ctx) => {
        const origins = [
          'https://coffeelogik.com',
          'https://www.coffeelogik.com',
        ];
        
        // Add development origins in non-production
        if (process.env.NODE_ENV !== 'production') {
          origins.push('http://localhost:3000', 'http://localhost:3001');
        }
        
        // Add custom CORS origins from environment
        const customOrigins = process.env.CORS_ORIGIN;
        if (customOrigins) {
          origins.push(...customOrigins.split(','));
        }
        
        return origins;
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
