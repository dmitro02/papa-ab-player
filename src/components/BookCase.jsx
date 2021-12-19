const BookCase = ({ bookList, selectBook, refresh }) => {
    const openBook = (book) => {
        selectBook('http://localhost:8888/books/' + book)
    }

    const goToPreviousPage = () => {

    }

    const goToNextPage = () => {

    }

    return (
        <>
            <div className="top-bar">
                <div>
                    <button className="nav-arrow-left-btn" onClick={goToPreviousPage} />
                    <button className="nav-arrow-right-btn" onClick={goToNextPage} />
                </div>
                <button className="reload-btn" onClick={refresh} />
            </div>
                <div className="book-case"> 
                    <div className="book-shelf left">
                        {bookList && bookList.slice(0,10).map(book => 
                            <div className="book-title" key={book} onClick={() => openBook(book)}>
                                {book}
                            </div>)
                        }
                    </div>
                    <div className="book-shelf right">
                        {bookList && bookList.slice(10,20).map(book => 
                            <div className="book-title" key={book} onClick={() => openBook(book)}>
                                {book}
                            </div>)
                        }
                    </div>
            </div>
        </>
    )
}

export default BookCase