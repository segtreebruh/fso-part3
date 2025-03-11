require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

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

app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      return `
        <div>
          <p>Phonebook currently has ${count} people</p>
          <p>${new Date()}</p>
        </div>`;
    })
    .then((info) => res.send(info))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else {
        // console.log('not found');
        res.status(404).end();
      }
    })
    .catch((err) => next(err));

  // if next() is specified with an argument it means that it is an error
  // and will go straight to the next error-handling middleware
  // else it will go to the next middleware
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons/", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "missing name/number" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const id = req.params.id;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, content: "query" }
  )
    .then((result) => {
      if (result) res.json(result);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError")
    return res.status(400).send({ error: "malformed id" });
  else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
