const mongoose = require("mongoose");
require("dotenv").config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

// if appName = '', will be saved in folder 'test'
// else will be saved in folder 'appName'
const appName = "phonebook";

const url = `mongodb+srv://${username}:${password}@cluster0.fbmd6.mongodb.net/${appName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  console.log("missing name/number");
  process.exit(1);
}

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
});

person
  .save()
  .then((res) => {
    console.log("person saved to database");
    return Person.find({});
  })
  .then((res) => {
    res.forEach((person) => console.log(person));
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
