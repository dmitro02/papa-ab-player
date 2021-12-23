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

    const [ showPlayer, setShowPlayer ] = 
        useState({ show: false, autoStart: false})

    const loadBooks = (shouldUpdateDb) => {
        setBookList([])
        shouldUpdateDb
            ? updateLibrary().then(setBookList)
            : fetchBooks().then(setBookList)
    }

    const resume = () => setShowPlayer({ show: true, autoStart: true })

    const selectBook = (book) =>
        setSelectedBookId(book.id)
            .then((book) => {
                setSelectedBook(book)
                resume()
            })

    useEffect(() => {
        loadBooks()
        getSelectedBook().then((book) => {
            if (book.id) {
                setSelectedBook(book)
                setShowPlayer({ show: true })
            }
        })
    }, [])

    return (
        <div className="main-container">
            {showPlayer.show 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setShowPlayer({ show: false })}
                    autoStart={showPlayer.autoStart}
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
