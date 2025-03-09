require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/**
 * Will not work - instead '/' will display the index.html file in 'dist' folder 
 * To fix, move app.use(express.static('dist')) to below the function
 * In fact, if check log in connection - will see connecting to /api/persons on default page instead 
 */
// app.get("/", (req, res) => {
//   res.send("success");
// });

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => res.json(person));
});

app.get("/info", (req, res) => {
  const date = Date();

  const info = `
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${date}</div>
    `;
  res.send(info);
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const deleted = persons.find((person) => person.id === id);
  if (!deleted) console.log("Resource not found");
  else persons = persons.filter((person) => person.id !== id);

  // 204 No Content
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "missing name/number" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then((person) => {
    res.json(person);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
