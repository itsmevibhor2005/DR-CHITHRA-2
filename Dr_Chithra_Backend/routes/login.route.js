// routes/authRoutes.js
import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/login.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";


const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout",verifyToken, logoutAdmin);
export default router;
