import crypto from "node:crypto";

export function requireAccessToken(req, res, next) {
  const configuredToken = process.env.DOCUMIND_ACCESS_TOKEN;
  const suppliedToken = req.get("x-documind-access-token") || "";

  if (!configuredToken) {
    console.error("DOCUMIND_ACCESS_TOKEN is not configured.");
    return res.status(503).json({
      message: "Uploads are temporarily unavailable. Please contact the administrator.",
    });
  }

  const expected = Buffer.from(configuredToken);
  const received = Buffer.from(suppliedToken);
  const valid = expected.length === received.length &&
    crypto.timingSafeEqual(expected, received);

  if (!valid) {
    return res.status(403).json({
      message: "An active access token is required. Please request one from your administrator.",
    });
  }

  return next();
}
