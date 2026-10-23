import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
export const SESSION_COOKIE =
  process.env.SESSION_COOKIE_NAME || "documind_session";

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
export function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
export function createSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}
export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { userId, tokenHash: hashSessionToken(token), expiresAt },
  });
  return { token, expiresAt };
}

export async function getSessionUser(token) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });
  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return { session, user: session.user };
}

export async function revokeSession(token) {
  if (token)
    await prisma.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
}
