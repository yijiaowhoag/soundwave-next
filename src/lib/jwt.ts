import { EncryptJWT, jwtDecrypt } from 'jose';
import { v4 as uuid } from 'uuid';
import hkdf from '@panva/hkdf';

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const now = () => (Date.now() / 1000) | 0;

export async function encrypt(params: JWTEncodeParams): Promise<string> {
  const {
    payload = {},
    secret = process.env.TOKEN_SECRET,
    maxAge = DEFAULT_MAX_AGE,
  } = params;

  const encryptionSecret = await getDerivedEncryptionKey(secret);

  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(uuid())
    .encrypt(encryptionSecret);
}

export async function decrypt(params: JWTDecodeParams) {
  const { token, secret = process.env.TOKEN_SECRET } = params;

  if (!token || token === 'undefined') return null;

  const encryptionSecret = await getDerivedEncryptionKey(secret);
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  });

  return payload;
}

async function getDerivedEncryptionKey(secret: string | Buffer) {
  return await hkdf('sha256', secret, '', '', 32);
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface DefaultJWT extends Record<string, unknown> {
  accessToken: string;
  refreshToken: string;
  exp: number;
  user: User;
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams {
  /** The JWT payload. */
  payload?: JWT;
  /** The secret used to encode the NextAuth.js issued JWT. */
  secret: string | Buffer;
  /**
   * The maximum age of the NextAuth.js issued JWT in seconds.
   * @default 30 * 24 * 30 * 60 // 30 days
   */
  maxAge?: number;
}

export interface JWTDecodeParams {
  token?: string;
  secret: string | Buffer;
}
