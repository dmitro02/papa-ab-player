import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'papa-ab-db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

export const getBookList = () =>
    Object.entries(db.data.books)
          .map(([ k, v ]) => ({ id: k, ...v }))

export const getBook = id => {
    const book = db.data.books[id]
    return { id, ...book }
}

export const setBook = async (id, book) => {
    const { books } = db.data
    books[id] = {
        ...books[id],
        ...book
    }
    await db.write()
    return getBook(id)
}

export const getSelectedBook = () =>
    getBook(db.data.selectedBookId)

export const setSelectedBookId = async (id) => {
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

export const updateDb = async (booksFolder) => {
    const files = fs.readdirSync(booksFolder)
    const { books } = db.data
    const bookList = Object.values(books)
    files.forEach(fileName => {
        if (!bookList.find((it) => it.fl === fileName)) {
            books[generateId()] = {
                fl: fileName,
                ps: 0,
                cm: false
            }
        }
    })
    await db.write()
}

export const initDb = async (booksFolder) => {
    await db.read()
    db.data = db.data || { books: {} }
    updateDb(booksFolder)
}

export default db
