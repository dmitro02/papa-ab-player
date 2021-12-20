import { PAGE_SIZE  } from "./BookCase"
import { getBookTitle } from '../utils'

const BOOKS_API_URL = 'http://localhost:8888/books/'

const BookShelf = ({bookList, pageNumber, selectBook, customClasses}) => {
    const classes = ['book-shelf', ...customClasses].join(' ') 

    const startIndex = pageNumber * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE

    const openBook = (book) => selectBook(BOOKS_API_URL + book)

    return (
        <div className={classes}>
            {bookList.slice(startIndex, endIndex).map(book => 
                <div 
                    className="book-title" 
                    key={book} 
                    onClick={() => openBook(book)} 
                    title={getBookTitle(book)}
                >
                    {book}
                </div>)
            }
        </div>
    )
}

export default BookShelf
