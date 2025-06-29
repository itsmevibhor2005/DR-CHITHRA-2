import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import {
  addLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/courses.controller.js";
import { uploadLecturePdf } from "../middlewares/multer.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET all courses (no auth required)
router.get("/", getAllCourses);

// ADD course (auth required + file upload)
router.post("/", verifyToken, upload.any(), addCourse);

// UPDATE course (auth required)
router.route("/:id").put(
  upload.single("coverImage"), // Handle single file upload
  updateCourse
);

// DELETE course (auth required)
router.delete("/:id", verifyToken, deleteCourse);

router.post("/:id/lectures",verifyToken, upload.single("pdf"), addLecture);
router.put(
  "/:courseId/lectures/:lectureIndex", verifyToken,
  upload.single("pdf"),
  updateLecture
);
router.delete("/:courseId/lectures/:lectureIndex",verifyToken, deleteLecture);

export default router;
