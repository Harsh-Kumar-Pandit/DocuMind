import { getSessionUser, SESSION_COOKIE } from "../services/auth.service.js";

export function readCookie(req, name) {
  const header = req.headers.cookie || "";
  const pair = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

export async function authenticate(req, res, next) {
  try {
    const result = await getSessionUser(readCookie(req, SESSION_COOKIE));
    if (!result)
      return res.status(401).json({ message: "Authentication required." });
    req.user = result.user;
    req.session = result.session;
    return next();
  } catch (error) {
    console.error("Authentication lookup failed:", error.message);
    return res.status(401).json({ message: "Authentication required." });
  }
}
