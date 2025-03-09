const mongoose = require("mongoose");
require('dotenv').config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

// if appName = '', will be saved in folder 'test'
// else will be saved in folder 'appName'
const appName = '';

const url = `mongodb+srv://${username}:${password}@cluster0.fbmd6.mongodb.net/${appName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is easy",
  important: true,
});

note.save().then((result) => {
  console.log(result);
  console.log("note saved!");
  mongoose.connection.close();
});
