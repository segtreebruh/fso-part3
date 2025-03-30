const appRouter = require('express').Router();
const Person = require('../models/person');

/**
 * Will not work - instead '/' will display the index.html file in 'dist' folder
 * To fix, move app.use(express.static('dist')) to below the function
 * In fact, if check log in connection - will see connecting to /api/persons on default page instead
 */
// app.get("/", (req, res) => {
//   res.send("success");
// });

appRouter.get('/', (req, res) => {
  Person.find({}).then((person) => res.json(person));
});

appRouter.get('/info', (req, res, next) => {
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

appRouter.get('/:id', (req, res, next) => {
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

appRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

appRouter.post('/', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'missing name/number' });
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

appRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body;
  const id = req.params.id;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, content: 'query' }
  )
    .then((result) => {
      if (result) res.json(result);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

module.exports = appRouter;