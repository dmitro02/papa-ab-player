import { useState, useEffect } from 'react'
import BookPlayer from './BookPlayer'
import BookCase from './BookCase'
import { fetchBooks, updateLibrary } from '../bookService'

const MainContainer = () => {
    const [ bookList, setBookList ] = useState([])

    const [ selectedBook, setSelectedBook ] = useState(null)

    const loadBooks = (shouldUpdateDb) => {
        setBookList([])
        shouldUpdateDb
            ? updateLibrary().then(setBookList)
            : fetchBooks().then(setBookList)
    }

    useEffect(loadBooks, [])
    
    return (
        <div className="main-container">
            {selectedBook 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setSelectedBook(null)}
                />
                : <BookCase 
                    bookList={bookList} 
                    selectBook={setSelectedBook} 
                    refresh={() => loadBooks(true)}
                />
            }
        </div>
    )
}

export default MainContainer
