const fs = require('fs').promises;
const path = require('path');

module.exports = async (app) => {
  try {
    const data = await fs.readFile('db/db.json', 'utf8');
    const notes = JSON.parse(data);

    app.get('/api/notes', (req, res) => {
      res.json(notes);
    });

    app.post('/api/notes', async (req, res) => {
      const newNote = req.body;
      notes.push(newNote);
      await updateDb();
      console.log('Added new note: ' + newNote.title);
      res.json(newNote); // Return the newly added note.
    });

    app.get('/api/notes/:id', (req, res) => {
      const id = req.params.id;
      if (id >= 0 && id < notes.length) {
        res.json(notes[id]);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    });

    app.delete('/api/notes/:id', async (req, res) => {
      const id = req.params.id;
      if (id >= 0 && id < notes.length) {
        notes.splice(id, 1);
        await updateDb();
        console.log('Deleted note with id ' + id);
        res.sendStatus(204); // No content.
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    });

    app.get('/notes', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    async function updateDb() {
      await fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), 'utf8');
    }
  } catch (err) {
    throw err;
  }
};
