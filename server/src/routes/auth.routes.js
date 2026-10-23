import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authRateLimit } from "../middleware/auth-rate-limit.js";

const router = Router();
router.post("/register", authRateLimit({ max: 5 }), register);
router.post("/login", authRateLimit({ max: 10 }), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
export default router;
