// note.routes.js
import { Router } from "express";
import {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNoteById,
    clearNotes,
} from "./notes.service.js";

const router = Router();

router.post("/notes", async (req, res) => {
    const { title = "", content = "" } = req.body || {};

    if (!String(title).trim()) {
        return res.status(400).json({ error: "Title is required" });
    }

    const note = await createNote(title, content);
    res.status(201).json(note);
});

router.get("/notes", async (req, res) => {
    const notes = await getAllNotes();
    res.json(notes);
});

router.get("/notes/:id", async (req, res) => {
    const note = await getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
});

router.put("/notes/:id", async (req, res) => {
    const { title, content } = req.body || {};

    if (title !== undefined && !String(title).trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    const updated = await updateNote(req.params.id, title, content);
    if (!updated) return res.status(404).json({ error: "Note not found" });

    res.json(updated);
});

router.delete("/notes/:id", async (req, res) => {
    const rowCount = await deleteNoteById(req.params.id);
    if (rowCount === 0) return res.status(404).json({ error: "Note not found" });
    res.status(204).send();
});

router.delete("/notes", async (req, res) => {
    await clearNotes();
    res.status(204).send();
});

export default router;
