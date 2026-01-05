// notes.service.js
import { pool } from "./db.js";

export async function createNote(title, content) {
    const { rows } = await pool.query(
        `INSERT INTO notes (title, content)
     VALUES ($1, $2)
     RETURNING id, title, content,
       created_at as "createdAt",
       updated_at as "updatedAt"`,
        [String(title), String(content)]
    );

    return rows[0];
}

export async function getAllNotes() {
    const { rows } = await pool.query(
        `SELECT id, title, content,
      created_at as "createdAt",
      updated_at as "updatedAt"
     FROM notes
     ORDER BY id ASC`
    );

    return rows;
}

export async function getNoteById(id) {
    const { rows } = await pool.query(
        `SELECT id, title, content,
      created_at as "createdAt",
      updated_at as "updatedAt"
     FROM notes
     WHERE id=$1`,
        [Number(id)]
    );

    return rows[0] || null;
}

export async function updateNote(id, title, content) {
    const { rows } = await pool.query(
        `UPDATE notes
     SET
       title = COALESCE($2, title),
       content = COALESCE($3, content),
       updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, content,
       created_at as "createdAt",
       updated_at as "updatedAt"`,
        [
            Number(id),
            title !== undefined ? String(title) : null,
            content !== undefined ? String(content) : null,
        ]
    );

    return rows[0] || null;
}

export async function deleteNoteById(id) {
    const result = await pool.query(`DELETE FROM notes WHERE id=$1`, [Number(id)]);
    return result.rowCount; // 0 або 1
}

export async function clearNotes() {
    await pool.query(`TRUNCATE notes RESTART IDENTITY`);
}
