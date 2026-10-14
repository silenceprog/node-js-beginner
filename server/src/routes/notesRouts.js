import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

const router = Router();

router.use("/api", (req, res, next) => {
  console.log("Home");
  next();
});

router.get("/api/notes", getAllNotes);

router.get("/api/notes/:noteId", getNoteById);
router.post("/api/notes", createNote);
router.delete("/api/notes/:noteId", deleteNote);
router.patch("/api/notes/:noteId", updateNote);

export default router;
