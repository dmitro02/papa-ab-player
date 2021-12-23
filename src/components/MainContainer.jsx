import { useState, useEffect } from 'react'
import BookPlayer from './BookPlayer'
import BookCase from './BookCase'
import { 
    fetchBooks, 
    setSelectedBookId, 
    getSelectedBook,
    updateLibrary 
} from '../bookService'

const MainContainer = () => {
    const [ bookList, setBookList ] = useState([])

    const [ selectedBook, setSelectedBook ] = useState(null)

    const loadBooks = (shouldUpdateDb) => {
        setBookList([])
        shouldUpdateDb
            ? updateLibrary().then(setBookList)
            : fetchBooks().then(setBookList)
    }

    const selectBook = (book) =>
        setSelectedBookId(book.id)
            .then((book) => setSelectedBook(book))

    useEffect(() => {
        loadBooks()
        getSelectedBook().then((book) => setSelectedBook(book))
    }, [])
    
    const resume = () =>
        getSelectedBook().then((book) => setSelectedBook(book))

    return (
        <div className="main-container">
            {selectedBook 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setSelectedBook(null)}
                />
                : <BookCase 
                    bookList={bookList} 
                    selectBook={selectBook} 
                    refresh={() => loadBooks(true)}
                    resume={resume}
                />
            }
        </div>
    )
}

export default MainContainer
