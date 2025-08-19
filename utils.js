export const nowISO = () => new Date().toISOString();
export const findNoteIndex = (id) => notes.findIndex(n => n.id === id);