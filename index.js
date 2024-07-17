require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person");

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("content", (req, res) => (Object.keys(req.body).length ? JSON.stringify(req.body) : " "));
app.use("*", morgan(":method :url :status :res[content-length] - :response-time ms :content"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(result => {
    res.json(result);
  });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "name and/or number are missing",
    });
  }

  // !!! Ignore duplicate names for now
  // if (persons.find(p => p.name === req.body.name)) {
  //   return res.status(409).json({
  //     error: `person named ${req.body.name} already exists in the phonebook. name must be unique`
  //   })
  // }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson.save().then(result => {
    res.json(result);
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

// app.get("/info", (req, res) => {
//   const htmlToSend = (
//     `<div>
//       <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? "person" : "people"}</p>
//       <p>${new Date().toString()}</p>
//     </div>`
//   )
//   res.send(htmlToSend);
// })

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
