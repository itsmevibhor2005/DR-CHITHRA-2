import express from "express";
import {
  getPublications,
  addPublication,
  updatePublication,
  deletePublication,
} from "../controllers/publications.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// GET (no auth)
router.get("/:section", getPublications);

// POST, PUT, DELETE (auth required)
router.post("/:section", verifyToken, addPublication);
router.put("/:section/:id", verifyToken, updatePublication);
router.delete("/:section/:id", verifyToken, deletePublication);

export default router;
