/**
 * Application configuration
 * All environment variables and configuration should be defined here
 */

function requireEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/talently',
    options: {
      bufferCommands: process.env.DB_BUFFER_COMMANDS === 'true',
    },
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },

  // Email configuration
  email: {
    from: process.env.EMAIL_FROM || 'noreply@talently.com',
    smtp: {
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },

  // Security configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    sessionCookieName: process.env.SESSION_COOKIE_NAME || 'session',
    csrfCookieName: process.env.CSRF_COOKIE_NAME || 'csrf',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },

  // Feature flags
  features: {
    emailNotifications: process.env.FEATURE_EMAIL_NOTIFICATIONS === 'true',
    analytics: process.env.FEATURE_ANALYTICS === 'true',
  },

  // Validation constants
  validation: {
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
      maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH || '100', 10),
    },
    name: {
      minLength: parseInt(process.env.NAME_MIN_LENGTH || '2', 10),
      maxLength: parseInt(process.env.NAME_MAX_LENGTH || '100', 10),
    },
    basicInfo: {
      minLength: parseInt(process.env.BASIC_INFO_MIN_LENGTH || '10', 10),
      maxLength: parseInt(process.env.BASIC_INFO_MAX_LENGTH || '1000', 10),
    },
  },

  // API rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (15 * 60 * 1000).toString(), 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // Limit each IP to 100 requests per windowMs
  },

  // Monitoring
  monitoring: {
    logLevel: process.env.LOG_LEVEL || 'info',
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
    },
  },

  // Image configuration
  images: {
    domains: process.env.IMAGE_DOMAINS?.split(',') || ['localhost'],
    maxSize: parseInt(process.env.MAX_IMAGE_SIZE || (5 * 1024 * 1024).toString(), 10), // 5MB
    allowedTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'],
  },

  // Cache configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || (60 * 60).toString(), 10), // 1 hour
    staleWhileRevalidate: parseInt(process.env.CACHE_STALE_WHILE_REVALIDATE || '60', 10), // 1 minute
  },
} as const

// Type for the config object
export type Config = typeof config

export default config 