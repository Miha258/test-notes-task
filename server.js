// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import notesRouter from "./note.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Реєстрація роутів
app.use(notesRouter);

// Головна сторінка
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Notes API running on http://localhost:${PORT}`);
});
