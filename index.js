const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('messageBody', (request, response) =>{
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :messageBody'))

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.filter(person => person.id === id)
    response.json(person)
})

app.get('/info', (request, response) => {
    const message = `Phonebook has info for ${persons.length} people<br/>${Date()}`
    response.send(message)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'New entry must have a name and number.'
        })
    }
    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name already added to the phone book.'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.random() * (1000000 - 5) + 5
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})