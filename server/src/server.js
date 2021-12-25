import express from 'express'
import { join, dirname, extname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import fs from 'fs'

const [ libraryPath, port = 8888 ] = process.argv.slice(2)

// ####################### DATABASE #######################

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'papa-ab-db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

const getBookList = () =>
    Object.entries(db.data.books)
          .map(([ k, v ]) => ({ id: k, ...v }))
          .sort((a, b) => {
              if (a.fl < b.fl) return -1
              if (a.fl > b.fl) return 1
              return 0
          })

const getBook = id => {
    const book = db.data.books[id]
    return book ? { id, ...book } : null
}

const setBook = async (book) => {
    const { id, ...newBook } = book
    const { books } = db.data
    books[id] = {
        ...books[id],
        ...newBook
    }
    await db.write()
    return getBook(id)
}

const getSelectedBook = () =>
    getBook(db.data.selectedBookId)

const setSelectedBookId = async (id) => {
    db.data.selectedBookId = id
    await db.write()
}

const generateId = (length = 10) => {
    let id = ''
    while (id.length < length) {
        id += Math.floor(Math.random() * 1E10).toString()
    }
    return id.substring(0, length)
}

const updateDb = async (booksFolder) => {
    const files = fs.readdirSync(booksFolder)
    const audioFiles = files.filter(fileName =>
        allowedFormats.includes(extname(fileName))
    )

    const { books } = db.data
    const bookList = Object.values(books)

    audioFiles.forEach(fileName => {
        if (!bookList.find((it) => it.fl === fileName)) {
            books[generateId()] = {
                fl: fileName,
                ps: 0,
                cm: false
            }
        }
    })

    Object.entries(books).forEach(([ k, v ]) => {
        if (!audioFiles.includes(v.fl)) delete books[k]
    })

    if (!getSelectedBook()) db.data.selectedBookId = null

    await db.write()
}

const initDb = async (booksFolder) => {
    await db.read()
    db.data = db.data || { books: {} }
    updateDb(booksFolder)
}

const allowedFormats = [
    '.mp3',
    '.mp4',
    '.m4a',
    '.m4b',
    '.aac',
    '.ogg',
    '.wma',
    '.wav'    
]

// ####################### SERVER #######################

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.get('/books', async (req, res) => {
    try {
        req.query.updateDb === 'true' && await initDb(libraryPath)
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
        res.send(payload || {})
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.post('/books/selected', async (req, res) => {
    try {
        await setSelectedBookId(req.query.id)
        const payload = getSelectedBook()
        res.status(201).send(payload)      
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.post('/book', async (req, res) => {
    try {
        const payload = await setBook(req.body)
        res.status(201).send(payload)
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

app.get('/media/:bookId', (req, res) => {
    try {
        const book = getBook(req.params.bookId)
        res.sendFile(join(libraryPath, book.fl))
    } catch (e) {
        console.log(e.message)
        res.status(500).end(e.message)
    }
})

initDb(libraryPath)

app.listen(port, () => 
    console.log(`Server listening at http://localhost:${port}`))
