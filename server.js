const express = require('express');
const app = express();
const PORT = process.env.port || 3001;
const path = require('path');
const uuid = require('./Develop/helpers/uuid')
const notes = require('./Develop/db/db.json');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public', 'index.html')));
app.get('/notes', (req, res)=> res.sendFile(path.join(__dirname, '/public', 'notes.html')));


app.get('/api/notes', (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);

  // Read the notes from the db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json('Error in getting notes');
    } else {
      // Parse the data from the file into a JavaScript array
      const notes = JSON.parse(data);
      
      // Sending all notes to the client
      res.json(notes);
    }
  });
});


  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNotes = {
        title,
        text,
        id: uuid(),
      };

      const response = {
        status: 'success',
        body: newNotes,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting notes');
    }
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        const newNotes = {
          title:req.body.title,
          text: req.body.text,
          id: uuid(),
         };
     
        // Add a new review
        parsedNotes.push(newNotes);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (error) =>
            error
              ? console.error(error)
              : console.info('Successfully updated Notes!')
        );
      }
    });

});

app.delete('/api/notes/:id', (req, res)=>{
 const noteId = req.params.id;
 const noteIndex = activeNote.findIndex((note) => 
 note.id === noteId);
  
 if (noteIndex >= 0) {
    // Remove the note from the array
    activeNote.splice(noteIndex, 1);
 // Write updated reviews back to the file
 fs.writeFile(
  './db/db.json',
  JSON.stringify(notes, null, 4),
  (error) =>
    error
      ? console.error(error)
      : console.info('Successfully updated Notes!')
);
 }});




app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`)
);