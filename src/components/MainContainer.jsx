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

    const [ showPlayer, setShowPlayer ] = useState(false)

    const loadBooks = (shouldUpdateDb) => {
        setBookList([])
        shouldUpdateDb
            ? updateLibrary().then(setBookList)
            : fetchBooks().then(setBookList)
    }

    const selectBook = (book) =>
        setSelectedBookId(book.id)
            .then((book) => {
                setSelectedBook(book)
                setShowPlayer(true)
            })

    useEffect(() => {
        loadBooks()
        getSelectedBook().then((book) => {
            if (book.id) {
                setSelectedBook(book)
                setShowPlayer(true)
            }
        })
    }, [])
    
    const resume = () => setShowPlayer(true)

    return (
        <div className="main-container">
            {showPlayer 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setShowPlayer(false)}
                />
                : <BookCase 
                    bookList={bookList} 
                    selectBook={selectBook} 
                    refresh={() => loadBooks(true)}
                    resume={resume}
                    disableResume={!selectedBook}
                />
            }
        </div>
    )
}

export default MainContainer
