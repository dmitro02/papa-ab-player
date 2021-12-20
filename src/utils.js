export const getBookTitle = (bookUrl) => {
    let arr = bookUrl.split('/')
    const index = arr.length > 1 ? arr.length - 1 : 0
    arr = arr[index].split(/(\.){1}[a-z0-9]{3}/)
    return arr[0]
} 