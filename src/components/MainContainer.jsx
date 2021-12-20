import { useState, useEffect } from 'react'
import BookPlayer from './BookPlayer'
import BookCase from './BookCase'
import { fetchBooks } from '../bookService'

const MainContainer = () => {
    const [ bookList, setBookList ] = useState([])

    const [ selectedBook, setSelectedBook ] = useState(null)

    const loadBooks = () => {
        setBookList([])
        fetchBooks().then(setBookList)
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
                    refresh={loadBooks}
                />
            }
        </div>
    )
}

export default MainContainer
