const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://vikramjit360:${password}@phonebook.hwu5izx.mongodb.net/Contacts?retryWrites=true&w=majority&appName=Phonebook`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model("person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(r => console.log(`${r.name} ${r.number}`));
    mongoose.connection.close();
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  })
} else {
  mongoose.connection.close();
}