require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((result) => {
      res.send(result)
    })
    .catch((error) => res.status(500).send({ error: error }))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      res.send(person)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).send({ error: 'name or number missing' })
  }

  Person.find({ name: body.name }).then((result) => {
    if (result.length > 0) {
      res.status(400).send({ error: 'name must be unique' })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then((person) => {
        res.send(person)
      })
    }
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).send({ error: 'name or number missing' })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).end()
      }
      res.send(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)
