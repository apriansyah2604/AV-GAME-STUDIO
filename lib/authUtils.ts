import { createHash } from 'crypto';

// Hash password using SHA256
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password against hashed password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

// Normalize owner user ID
export function normalizeOwnerUserId(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

// Get seed admin credentials from environment variables
export function getSeedAdminCredentials() {
  const username = process.env.DEFAULT_ADMIN_USERNAME?.trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

  if (username && password) {
    return { username, password };
  }

  if (process.env.NODE_ENV !== 'production') {
    return { username: 'admin', password: 'admin123' };
  }

  return null;
}
