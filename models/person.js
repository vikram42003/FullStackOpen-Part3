const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("could not connect to the database -", error.message);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id }
})

module.exports = new mongoose.model("Person", personSchema);