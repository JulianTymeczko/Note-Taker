const express = require('express');
const fs = require('fs')
const PORT = 3001;
const app = express();
const path = require('path');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
  console.log('hello')
  fs.readFile('db/db.json', 'utf8', (error, data) =>
    error ? console.error(error) : res.json(JSON.parse(data))
  );
});



app.post('/api/notes', (req, res) => {
  console.log(req.body, "look here")
  fs.readFile('db/db.json', 'utf8', (error, data) => {
    console.log(data)
    if (error) {
      return console.error(error);
    }
    
    // Add data to the db object
    
    const note = req.body;
    
    const db = JSON.parse(data);
    db.push({ "title": note.title, "text": note.text, "id": note.id });
    // Write to file with updated data
    fs.writeFile('db/db.json', JSON.stringify(db), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(data)
    })
  });
}
)
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Read the current notes data from the JSON file
  fs.readFile('db/db.json', 'utf8', (error, data) => {
    if (error) {
      console.error('Error reading data from file:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const notes = JSON.parse(data);

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);

      // Write the updated notes data back to the JSON file
      fs.writeFile('db/db.json', JSON.stringify(notes), 'utf8', writeError => {
        if (writeError) {
          console.error('Error writing data to file:', writeError);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(204).send(); // No content, successful deletion
      });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });
});



app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
;




