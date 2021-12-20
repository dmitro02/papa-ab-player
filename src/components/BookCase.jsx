import { useState } from 'react'
import BookShelf from './BookShelf'
export const PAGE_SIZE = 10

const BookCase = ({ bookList, selectBook, refresh}) => {
    const [ pageNumber, setPageNumber ] = useState(0)

    const loading = !bookList || !bookList.length 

    const maxPageNumber = Math.floor(bookList.length / PAGE_SIZE)

    const hasPrevPage = pageNumber >= 2
    const hasNextPage = maxPageNumber - pageNumber >= 2

    const goToPreviousPage = () => {
        hasPrevPage && setPageNumber(pageNumber - 2)
    }

    const goToNextPage = () => {
        hasNextPage && setPageNumber(pageNumber + 2)
    }

    return (
        <>
            <div className="top-bar">
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
                    disabled={loading}
                />
            </div>
            {loading 
                ? <div className='spinner' />
                : <div className="book-case"> 
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
            }
        </>
    )
}

export default BookCase
