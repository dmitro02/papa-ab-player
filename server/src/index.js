import express from 'express'
import fs from 'fs'
import { getBook, setBook } from './db.js'

// const booksFolder = 'C:\\Data\\GoogleDrive\\Sound\\Notification Sounds'
const booksFolder = 'D:\\Downloads\\Audio\\Audiobooks\\Алиса в стране чудес'
// const booksFolder = 'D:\\Downloads\\Music'

const PORT = 8888

const app = express()
app.use(express.json())
app.use('/books', express.static(booksFolder))

app.get('/books', (req, res) => {
    try {
        const books = fs.readdirSync(booksFolder)
        res.send({ books, booksFolder })
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.get('/book', (req, res) => {
    try {
        const payload = getBook(req.body)
        res.send(payload)
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.post('/book', (req, res) => {
    try {
        const payload = setBook(req.body)
        res.send(payload)
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`))
