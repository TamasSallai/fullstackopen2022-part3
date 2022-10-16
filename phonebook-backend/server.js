const express = require('express')
const morgan = require('morgan')

const app = express()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id))

  if (!person) {
    return res.status(404).end()
  }

  res.send(person)
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body

  if (!newPerson.number) {
    return res.status(400).send({ error: 'number is missing' })
  }

  if (!newPerson.name) {
    return res.status(400).send({ error: 'name is missing' })
  }

  const isExsists = persons.find((person) => person.name === newPerson.name)
  if (isExsists) {
    return res.status(400).send({ error: 'name must be unique' })
  }

  newPerson.id = Math.floor(Math.random() * 10000000)
  persons.push(newPerson)

  res.send(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const numberOfPersons = persons.length
  persons = persons.filter((person) => person.id !== Number(req.params.id))

  if (persons.length === numberOfPersons.length) {
    return res.status(404).end()
  }

  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`)
})
