const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password, and optionally the name and the number as an argument: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log(
    'Please provide a number for the name as an argument: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

const url = process.env.MONGO_URI

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      const person = new Person({
        name: name,
        number: number,
      })
      return person.save()
    })
    .then((result) => {
      console.log(`added ${result.name} ${result.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

const getAllPersons = () => {
  mongoose
    .connect(url)
    .then(() => Person.find({}))
    .then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      )
      mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

if (process.argv.length === 3) {
  getAllPersons()
}

if (process.argv.length === 5) {
  addPerson(process.argv[3], process.argv[4])
}
