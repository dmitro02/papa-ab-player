export const apiFetchBooks = () =>
    fetch('/books').then(res => res.json())

export const apiUpdateBook = (book) => {
    return fetch('/book/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    }).then(res => res.json())
}

export const apiUpdateLibrary = () =>
    fetch('/books?updateDb=true').then(res => res.json())

export const apiGetSelectedBook = () =>
    fetch('/books/selected').then(res => res.json()) 

export const apiSetSelectedBookId = (id) =>
    fetch('/books/selected?id=' + id, { method: 'POST' })
        .then(res => res.json())
