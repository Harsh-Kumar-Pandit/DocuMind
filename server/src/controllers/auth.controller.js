import prisma from "../config/db.js";
import {
  createSession,
  hashPassword,
  normalizeEmail,
  revokeSession,
  SESSION_COOKIE,
  verifyPassword,
} from "../services/auth.service.js";
import { readCookie } from "../middleware/authenticate.js";

const cookieOptions = (expires) => ({
  httpOnly: true,
  sameSite: process.env.COOKIE_SAMESITE || "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  ...(expires ? { expires } : {}),
});
const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!name || name.length > 100 || !emailPattern.test(email))
    return { error: "Name and a valid email are required." };
  if (
    password.length < 10 ||
    password.length > 128 ||
    !/[A-Za-z]/.test(password) ||
    !/\d/.test(password)
  )
    return {
      error:
        "Password must be 10-128 characters and include a letter and a number.",
    };
  return { name, email, password };
}

export async function register(req, res) {
  const input = validateCredentials(req.body || {});
  if (input.error) return res.status(400).json({ message: input.error });
  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: await hashPassword(input.password),
      },
    });
    const session = await createSession(user.id);
    res.cookie(SESSION_COOKIE, session.token, cookieOptions(session.expiresAt));
    return res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    if (error.code === "P2002")
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    console.error("Registration failed:", error.message);
    return res.status(500).json({ message: "Could not create account." });
  }
}

export async function login(req, res) {
  const email =
    typeof req.body?.email === "string" ? normalizeEmail(req.body.email) : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password)
    return res.status(401).json({ message: "Invalid email or password." });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user
      ? await verifyPassword(password, user.passwordHash)
      : false;
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password." });
    const session = await createSession(user.id);
    res.cookie(SESSION_COOKIE, session.token, cookieOptions(session.expiresAt));
    return res.json({ user: safeUser(user) });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Could not sign in." });
  }
}

export async function logout(req, res) {
  await revokeSession(readCookie(req, SESSION_COOKIE));
  res.clearCookie(SESSION_COOKIE, cookieOptions(new Date(0)));
  return res.status(204).send();
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
