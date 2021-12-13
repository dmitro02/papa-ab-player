import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()
db.data ||= []

export const getBook = ({ title }) => {
    return db.data.find((book) => book.title === title)
}

export const setBook = ({ title, position }) => {
    const book = getBook({ title })
    book.position = position
    db.write()
    return book
}

export default db