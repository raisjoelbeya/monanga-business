'server-only';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex');
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function verifyPassword(
  suppliedPassword: string,
  storedPassword: string
): Promise<boolean> {
  if (!storedPassword) return false;
  
  const [hashedPassword, salt] = storedPassword.split('.');
  if (!hashedPassword || !salt) return false;
  
  const buf = (await scrypt(suppliedPassword, salt, 64)) as Buffer;
  return buf.toString('hex') === hashedPassword;
}
