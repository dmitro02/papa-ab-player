export const fetchBooks = () => {
    return fetch('/books').then(res => res.json()) 
}
export const fetchBookMeta = (book) => {
    return fetch('/book/' + book).then(res => res.json()) 
}
