const express = require("express");
const app = express();
app.use(express.json());

app.use("/api", (req, res, next) => {
  console.log("Home");
  next();
});

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/api/notes", (req, res) => {
  res.status(200);
  res.send(notes);
});

app.get("/api/notes/:id", (req, res) => {
  res.status(200);
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.send(note);
  } else {
    res.status(404).end();
  }
});
app.post("/api/notes", (req, res) => {
  const note = req.body;
  res.json(note);
  res.status(201);
});

app.delete("/api/notes/:id", (req, res) => {
  res.status(200);
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
