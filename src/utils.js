export const getNameNoExt = (fileName) =>
    fileName.split(/(\.){1}[a-z0-9]{3}/)[0]

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

export const sortByFileName = (a, b) => {
    if (a.fl < b.fl) return -1
    if (a.fl > b.fl) return 1
    return 0
}

export const sortByCompleted = (a, b) => {
    if (!a.cm && b.cm) return -1
    if (a.cm && !b.cm) return 1
    return 0
}
