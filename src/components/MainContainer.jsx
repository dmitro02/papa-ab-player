import { useState, useEffect } from 'react'
import BookPlayer from './BookPlayer'
import BookCase from './BookCase'
import { 
    apiFetchBooks, 
    apiSetSelectedBookId, 
    apiGetSelectedBook,
    apiUpdateLibrary,
    apiUpdateBook
} from '../bookService'
import { sortByFileName, sortByCompleted } from '../utils'

const MainContainer = () => {
    const [ bookList, setBookList ] = useState([])

    const [ selectedBook, setSelectedBook ] = useState(null)

    const [ showPlayer, setShowPlayer ] = 
        useState({ show: false, autoStart: false})

    const loadBooks = () => {
        setBookList([])
        apiFetchBooks().then(setBookList)
        apiGetSelectedBook().then((book) => {
            setSelectedBook(book.id ? book : null)
            setShowPlayer({ show: !book.cm })
        })
    }

    const reloadBooks = () => {
        setBookList([])
        apiUpdateLibrary().then(setBookList)
        apiGetSelectedBook().then((book) =>
            setSelectedBook(book.id ? book : null))
    }

    const resume = () => setShowPlayer({ show: true, autoStart: true })

    const selectBook = (book) =>
        apiSetSelectedBookId(book.id)
            .then((book) => {
                setSelectedBook(book)
                resume()
            })
    
    const updateBook = async (book, needSort) => {
        const updatedBook = await apiUpdateBook(book)
        const updatedBookList = [ ...bookList ]
        const index = updatedBookList.findIndex(b => b.id === book.id)
        updatedBookList[index] = updatedBook
        needSort && updatedBookList
            .sort(sortByFileName)
            .sort(sortByCompleted)
        setBookList(updatedBookList)
    } 

    useEffect(() => loadBooks(), [])

    return (
        <div className="main-container">
            {showPlayer.show 
                ? <BookPlayer 
                    book={selectedBook} 
                    goHome={() => setShowPlayer({ show: false })}
                    autoStart={showPlayer.autoStart}
                    updateBook={updateBook}
                />
                : <BookCase 
                    bookList={bookList} 
                    selectBook={selectBook} 
                    refresh={reloadBooks}
                    resume={resume}
                    disableResume={!selectedBook}
                />
            }
        </div>
    )
}

export default MainContainer
