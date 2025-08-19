import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { nowISO, findNoteIndex } from './utils.js'

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let notes = [];
let nextId = 1;
app.post("/notes", (req, res) => {
    const { title = "", content = "" } = req.body || {};
    if (!title.trim()) {
        return res.status(400).json({ error: "Title is required" });
    }
    const note = {
        id: nextId++,
        title: String(title),
        content: String(content),
        createdAt: nowISO(),
        updatedAt: nowISO(),
    };
    notes.push(note);
    console.log("[CREATE]", note);
    res.status(201).json(note);
});

app.get("/notes", (req, res) => {
    console.log("[READ ALL] count =", notes.length);
    res.json(notes);
});

app.get("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(n => n.id === id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    console.log("[READ ONE]", note);
    res.json(note);
});

app.put("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const idx = findNoteIndex(id);
    if (idx === -1) return res.status(404).json({ error: "Note not found" });

    const { title, content } = req.body || {};
    if (title !== undefined && !String(title).trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    const existing = notes[idx];
    const updated = {
        ...existing,
        title: title !== undefined ? String(title) : existing.title,
        content: content !== undefined ? String(content) : existing.content,
        updatedAt: nowISO(),
    };
    notes[idx] = updated;
    console.log("[UPDATE]", updated);
    res.json(updated);
});

app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const idx = findNoteIndex(id);
    if (idx === -1) return res.status(404).json({ error: "Note not found" });

    const removed = notes.splice(idx, 1)[0];
    console.log("[DELETE]", removed);
    res.status(204).send(); // no content
});

app.delete("/notes", (req, res) => {
    notes = [];
    console.log("[CLEAR ALL] notes cleared");
    res.status(204).send();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Notes API running on http://localhost:${PORT}`);
});
