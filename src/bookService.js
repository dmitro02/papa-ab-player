export const fetchBooks = () => {
    return fetch('/books')
        .then(res => res.json()) 
}

export const updateBook = (id, book) => {
    return fetch('/book/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    }).then(res => res.json())
}

export const updateLibrary = () => {
    return fetch('/books?updateDb=true')
        .then(res => res.json())
}
