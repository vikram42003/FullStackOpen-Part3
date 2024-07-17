const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("could not connect to the database -", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name should be at least 3 characters long"],
  },
  number: {
    type: String,
    validate: [
      /\b\d{2}-\d{6,}\b|\b\d{3}-\d{5,}\b/,
      "Number should be at least 8  characters long and should have a '-' after 2nd or 3rd digit. Example: 123-45678",
    ],
  },
});

personSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

module.exports = new mongoose.model("Person", personSchema);
