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

morgan.token("content", req => (Object.keys(req.body).length ? JSON.stringify(req.body) : " "));
app.use("*", morgan(":method :url :status :res[content-length] - :response-time ms :content"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: `Person with id: ${req.params.id} not found on the server` });
      }
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    next({ name: "name and/or number are missing" });
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true, runValidators: true, context: "query" })
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then(result => {
      const total = result.length;
      const htmlToSend = `<div>
        <p>Phonebook has info for ${total} ${total === 1 ? "person" : "people"}</p>
        <p>${new Date().toString()}</p>
      </div>`;
      res.send(htmlToSend);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "name and/or number are missing") {
    return res.status(400).json({ error: error.name });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
}
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
