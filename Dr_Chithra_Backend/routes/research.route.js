import express from "express";
const router = express.Router();
import {
  getAllInterests,
  
  addOrUpdateInterest,
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../controllers/research.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import {
  uploadProjectImages,
  uploadProjectNewImages,
} from "../middlewares/multer.middleware.js";

// Interests routes
router.get("/interests", getAllInterests);
router.post("/interests", verifyToken, addOrUpdateInterest);
router.put("/interests", verifyToken, addOrUpdateInterest); // Same handler



// Projects routes
router.get("/projects", getAllProjects);
router.post(
  "/projects",
  verifyToken,
  uploadProjectImages, // Max 10 images
  addProject
);
router.put(
  "/projects/:id",
  verifyToken,
  uploadProjectNewImages, // Max 10 new images
  updateProject
);
router.delete("/projects/:id", verifyToken, deleteProject);

export default router;
