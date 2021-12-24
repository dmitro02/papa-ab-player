export const fetchBooks = () =>
    fetch('/books').then(res => res.json())

export const updateBook = (book) => {
    return fetch('/book/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    }).then(res => res.json())
}

export const updateLibrary = () =>
    fetch('/books?updateDb=true').then(res => res.json())

export const getSelectedBook = () =>
    fetch('/books/selected').then(res => res.json()) 

export const setSelectedBookId = (id) =>
    fetch('/books/selected?id=' + id, { method: 'POST' })
        .then(res => res.json())
