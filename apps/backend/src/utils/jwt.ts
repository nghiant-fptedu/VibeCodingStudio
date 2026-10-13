import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vibespace_default_dev_jwt_secret_2026';
const JWT_EXPIRES_IN = '30d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
