import express from "express";
import { login, verify } from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// LOGIN route → handled by controller
router.post("/login", login);

// VERIFY route → only accessible if token is valid
router.get("/verify", verifyToken, verify);

export default router;
