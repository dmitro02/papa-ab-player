import express from 'express'
import { 
    initDb, 
    getBookList, 
    getBook, 
    setBook,
    getSelectedBook,
    setSelectedBookId
} from './db.js'
import { join } from 'path'

const PORT = 8888
const BOOKS_FOLDER = 'D:\\Downloads\\Audio\\Audiobooks\\Алиса в стране чудес'

const app = express()
app.use(express.json())

app.get('/books', async (req, res) => {
    try {
        req.query.updateDb === 'true' && await initDb(BOOKS_FOLDER)
        const payload = getBookList()
        res.send(payload)
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.get('/books/selected', (req, res) => {
    try {
        const payload = getSelectedBook()
        res.send(payload)
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.post('/books/selected', (req, res) => {
    try {
        setSelectedBookId(req.query.id)
            .then(() => {
                const payload = getSelectedBook()
                res.send(payload)
            })        
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.post('/book/:id', (req, res) => {
    try {
        setBook(req.params.id, req.body)
            .then(book => res.sendStatus(201).send(book))
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.get('/media/:bookId', (req, res) => {
    try {
        const book = getBook(req.params.bookId)
        res.sendFile(join(BOOKS_FOLDER, book.fl))
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

initDb(BOOKS_FOLDER)

app.listen(PORT, () => 
    console.log(`Server listening at http://localhost:${PORT}`))
