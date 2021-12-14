import { useState, useEffect } from 'react'
import BookPlayer from './BookPlayer'
import BookShelf from './BookShelf'
import { fetchBooks } from '../bookService'

const MainContainer = () => {
    const [ bookList, setBookList ] = useState([])

    const [ selectedBook, setSelectedBook ] = useState(null)

    const loadBooks = () => fetchBooks().then(setBookList)

    useEffect(loadBooks, [])
    
    return (
        <div className="main-container">
            {selectedBook 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setSelectedBook(null)}
                />
                : <BookShelf 
                    bookList={bookList} 
                    selectBook={setSelectedBook} 
                    refresh={loadBooks}
                />
            }
        </div>
    )
}

export default MainContainer
