export const getBookTitle = (bookUrl) => {
    let arr = bookUrl.split('/')
    const index = arr.length > 1 ? arr.length - 1 : 0
    arr = arr[index].split(/(\.){1}[a-z0-9]{3}/)
    return arr[0]
} 

export const formatTime = (seconds) => {
    let hours = Math.floor(seconds / 3600)
    seconds %= 3600
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    return `${format2Digit(hours)}:${format2Digit(minutes)}:${format2Digit(seconds)}`
}

export const format2Digit = (value) => {
    value = Math.ceil(value)
    return value < 10 ? '0' + value : value
}

export const afterIdle = (handler, delayMs) => {
    let timeout
    return (...args) => {
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => handler(...args), delayMs)
    }
}
