import { useState } from 'react'
import BookShelf from './BookShelf'
import LoadingSpinner from './LoadingSpinner'
import { 
    fetchBooks, 
    setSelectedBookId, 
    getSelectedBook,
    updateLibrary 
} from '../bookService'

export const PAGE_SIZE = 10

const BookCase = ({ bookList, selectBook, refresh, resume }) => {
    const [ pageNumber, setPageNumber ] = useState(0)

    const isLoading = !bookList || !bookList.length 

    const maxPageNumber = Math.floor(bookList.length / PAGE_SIZE)

    const hasPrevPage = pageNumber >= 2
    const hasNextPage = maxPageNumber - pageNumber >= 2

    const goToPreviousPage = () => {
        hasPrevPage && setPageNumber(pageNumber - 2)
    }

    const goToNextPage = () => {
        hasNextPage && setPageNumber(pageNumber + 2)
    }

    const resume = () =>
        getSelectedBook().then((book) => setSelectedBook(book))

    return (
        <>
            <div className="top-bar">
                <button 
                    className="" 
                    onClick={resume}
                    disabled={!resume} 
                >RESUME</button>
                <div>
                    <button 
                        className="nav-arrow-left-btn" 
                        onClick={goToPreviousPage}
                        disabled={!hasPrevPage} 
                    />
                    <button 
                        className="nav-arrow-right-btn" 
                        onClick={goToNextPage} 
                        disabled={!hasNextPage}
                    />
                </div>
                <button 
                    className="reload-btn" 
                    onClick={refresh} 
                    disabled={isLoading}
                />
            </div>
            {isLoading && <LoadingSpinner />}
            <div className="book-case"> 
                    <BookShelf 
                        bookList={bookList} 
                        pageNumber={pageNumber} 
                        selectBook={selectBook} 
                        customClasses={['left']}
                    />
                    <BookShelf 
                        bookList={bookList} 
                        pageNumber={pageNumber + 1} 
                        selectBook={selectBook} 
                        customClasses={['right']}
                    />                      
            </div>
        </>
    )
}

export default BookCase
