import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";
import { celebrate } from "celebrate";
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use("/api/notes", authenticate);

router.use("/api", (req, res, next) => {
  console.log("Home");
  next();
});

router.get("/api/notes", celebrate(getAllNotesSchema), getAllNotes);
router.get("/api/notes/:noteId", celebrate(noteIdSchema), getNoteById);
router.post("/api/notes", celebrate(createNoteSchema), createNote);
router.delete("/api/notes/:noteId", celebrate(noteIdSchema), deleteNote);
router.patch("/api/notes/:noteId", celebrate(updateNoteSchema), updateNote);

export default router;
