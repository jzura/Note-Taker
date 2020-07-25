  
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
    response.sendFile(path.join(staticDir, "../public/index.html"));
});

server.get("/notes", function (request, response) {
    response.sendFile(path.join(staticDir, "../public/notes.html"));
});

