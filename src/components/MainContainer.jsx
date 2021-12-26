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

    const loadBooks = () => {
        setBookList([])
        fetchBooks().then(setBookList)
        getSelectedBook().then((book) => {
            setSelectedBook(book.id ? book : null)
            setShowPlayer({ show: !book.cm })
        })
    }

    const reloadBooks = () => {
        setBookList([])
        updateLibrary().then(setBookList)
        getSelectedBook().then((book) =>
            setSelectedBook(book.id ? book : null))
    }

    const resume = () => setShowPlayer({ show: true, autoStart: true })

    const selectBook = (book) =>
        setSelectedBookId(book.id)
            .then((book) => {
                setSelectedBook(book)
                resume()
            })

    useEffect(() => loadBooks(), [])

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
                    refresh={() => reloadBooks()}
                    resume={resume}
                    disableResume={!selectedBook}
                />
            }
        </div>
    )
}

export default MainContainer
