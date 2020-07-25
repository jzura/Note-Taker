  
const express = require("express")
const path = require("path");
const fs = require("fs");

const staticDir = path.resolve(__dirname, "public");
const dbDir = path.resolve(__dirname, "db");
const dbFile = path.join(dbDir, "db.json");


// Sets up the Express server
const server = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express server to handle data parsing and serve static files
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(staticDir));

// Routes
server.get("/", function (request, response) {
    response.sendFile(path.join(staticDir, "index.html"));
});

server.get("/notes", function (request, response) {
    response.sendFile(path.join(staticDir, "notes.html"));
});

//function to read database file
server.get("/api/notes", function (request, response) {
    fs.readFile(dbFile, 'utf8', (error, data) => {
        if (error) throw error;
        if (data) {
            response.json(JSON.parse(data));
        } else {
            response.json([]);
        }

    });
});

//Create new note
server.post("/api/notes", (request, response) => {
    const currentNote = { title: request.body.title, text: request.body.text };
    fs.readFile(dbFile, 'utf8', (error, data) => {
        if (error) throw error;
        let savedNotes = data ? JSON.parse(data) : [];
        savedNotes.push(currentNote);
        savedNotes = savedNotes.map((note, index) => {
            note.id = index + 1;
            return note;
        });
        fs.writeFile(dbFile, JSON.stringify(savedNotes), error => {
            if (error) throw error;
            console.log(`New note with id = ${savedNotes.length} saved successfully`);
            response.json(currentNote);
        });
    });
});

//delete note
server.delete("/api/notes/:id", (request, response) => {
    fs.readFile(dbFile, 'utf8', (error, data) => {
        if (error) throw error;
        let savedNotes = data ? JSON.parse(data) : [];
        savedNotes = savedNotes.filter((note, index) => {
            return note.id != request.params.id;
        });
        fs.writeFile(dbFile, JSON.stringify(savedNotes), error => {
            if (error) throw error;
            response.end();
        });
    });
});



// Starts the server to begin listening
server.listen(PORT, function () {
    console.log("server listening on PORT " + PORT);
});