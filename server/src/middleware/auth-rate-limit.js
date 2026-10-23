const attempts = new Map();

export function authRateLimit({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const recent = (attempts.get(key) || []).filter(
      (time) => now - time < windowMs,
    );
    if (recent.length >= max)
      return res
        .status(429)
        .json({ message: "Too many attempts. Please try again later." });
    recent.push(now);
    attempts.set(key, recent);
    return next();
  };
}
