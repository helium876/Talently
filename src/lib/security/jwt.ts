import { SignJWT, jwtVerify } from 'jose'
import config from '../config'
import { logger } from '../monitoring/logger'

const JWT_SECRET = new TextEncoder().encode(config.auth.jwtSecret)
const JWT_ISSUER = 'talently'
const JWT_AUDIENCE = 'talently-app'

export interface JWTPayload {
  sub: string // subject (user id)
  iss?: string // issuer
  aud?: string // audience
  exp?: number // expiration time
  iat?: number // issued at
  jti?: string // JWT ID
}

/**
 * Signs a JWT token with the given payload
 * @param payload - The payload to sign
 * @returns The signed JWT token
 */
export async function signJWT(payload: JWTPayload): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    logger.error('Error signing JWT', { error })
    throw new Error('Failed to sign JWT')
  }
}

/**
 * Verifies a JWT token and returns the payload
 * @param token - The token to verify
 * @returns The verified payload
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    return payload as JWTPayload
  } catch (error) {
    logger.error('Error verifying JWT', { error })
    throw new Error('Failed to verify JWT')
  }
}

/**
 * Decodes a JWT token without verifying it
 * @param token - The token to decode
 * @returns The decoded payload
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64').toString()
    )
    return payload
  } catch (error) {
    logger.error('Error decoding JWT', { error })
    throw new Error('Failed to decode JWT')
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The token to check
 * @returns Whether the token is expired
 */
export function isJWTExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token)
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

/**
 * Gets the remaining time until a JWT token expires
 * @param token - The token to check
 * @returns The remaining time in seconds, or 0 if expired
 */
export function getJWTRemainingTime(token: string): number {
  try {
    const payload = decodeJWT(token)
    if (!payload.exp) return 0
    const remaining = payload.exp * 1000 - Date.now()
    return Math.max(0, Math.floor(remaining / 1000))
  } catch {
    return 0
  }
} 