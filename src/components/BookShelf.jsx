const BookShelf = ({ bookList, selectBook, refresh }) => {
    const openBook = (book) => {
        selectBook('http://localhost:8888/books/' + book)
    }

    return (
        <div className="book-shelf">
            <div className="button" onClick={refresh}>REFRESH</div>
            {bookList && bookList.map(book => 
                <div key={book} onClick={() => openBook(book)}>
                    {book}
                </div>)
            }
        </div>
    )
}

export default BookShelf