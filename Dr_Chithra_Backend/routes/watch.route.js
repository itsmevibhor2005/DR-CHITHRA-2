import express from "express";
const router = express.Router();
import {
  getAllCompetitions,
  addCompetition,
  updateCompetition,
  deleteCompetition,
  getAllJournals,
  addJournal,
  updateJournal,
  deleteJournal,
  getAllReads,
  addRead,
  updateRead,
  deleteRead,
} from "../controllers/watch.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

// Competitions routes
router.get("/competitions", getAllCompetitions);
router.post("/competitions", verifyToken, addCompetition);
router.put("/competitions/:id", verifyToken, updateCompetition);
router.delete("/competitions/:id", verifyToken, deleteCompetition);

// Journals routes
router.get("/journals", getAllJournals);
router.post("/journals", verifyToken, addJournal);
router.put("/journals/:id", verifyToken, updateJournal);
router.delete("/journals/:id", verifyToken, deleteJournal);

// Reads routes
router.get("/reads", getAllReads);
router.post("/reads", verifyToken, addRead);
router.put("/reads/:id", verifyToken, updateRead);
router.delete("/reads/:id", verifyToken, deleteRead);

export default router;
