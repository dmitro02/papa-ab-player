import { PAGE_SIZE  } from "./BookCase"
import { getBookTitle } from '../utils'

const BookShelf = ({bookList, pageNumber, selectBook, customClasses}) => {
    const classes = ['book-shelf', ...customClasses].join(' ') 

    const startIndex = pageNumber * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE

    return (
        <div className={classes}>
            {bookList.slice(startIndex, endIndex).map(book => 
                <div 
                    className="book-title" 
                    key={book.id} 
                    onClick={() => selectBook(book)} 
                    title={getBookTitle(book.fl)}
                >
                    {getBookTitle(book.fl)}
                </div>)
            }
        </div>
    )
}

export default BookShelf
