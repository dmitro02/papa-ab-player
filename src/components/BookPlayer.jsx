import { useState, useRef, useEffect } from 'react'
import { FaList } from 'react-icons/fa'
import { BsPlayBtn, BsPauseBtn } from 'react-icons/bs'
import { BiVolumeFull } from 'react-icons/bi'
import { ImClock } from 'react-icons/im'
import { getNameNoExt, formatTime, afterIdle } from '../utils'
import LoadingSpinner from './LoadingSpinner'
import { apiGetBookMetadata } from '../bookService'

const DEFAULT_VOLUME = 0.3
const LS_ITEM_VOLUME = 'papaAbPlayer.volume'

const getImgSrc = (meta) => {
    const imgBuffer = meta.cover?.data.data 
    if (!imgBuffer) return null
    const blob = new Blob([new Uint8Array(imgBuffer).buffer])
    return URL.createObjectURL(blob)
}

const normalizeMeta = (meta) => {
    let { album, albumartist, artist, title } = meta
    return {
        ...meta,
        albumartist: albumartist === artist ? null : albumartist,
        album: album === title ? null : album,
        imgSrc: getImgSrc(meta)
    }
}

const BookPlayer = ({ 
    book, 
    goHome, 
    autoStart, 
    updateBook 
}) => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ bookMeta, setBookMeta ] = useState(null)

    useEffect(() => {
        const setInitialVolume = () => {
            const volume = parseFloat(localStorage.getItem(LS_ITEM_VOLUME)) 
                || DEFAULT_VOLUME
            setVolume(volume)
            volumeRef.current.value = volume
        }

        const setInitialTime = () => {
            audioRef.current.currentTime = book.ps
        }

        const getMeta = async () => {
            const meta = await apiGetBookMetadata(book.id)
            setBookMeta(normalizeMeta(meta))
        }

        setInitialVolume()
        setInitialTime()
        getMeta()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [book.id])

    const audioRef = useRef()
    const progressRef = useRef()
    const timeRef = useRef()
    const durationRef = useRef()
    const volumeRef = useRef()

    const play = () => audioRef.current.play()

    const pause = () => audioRef.current.pause()

    const handleLoadedMetadata = () => {
        const { duration, currentTime } = audioRef.current
        progressRef.current.setAttribute('max', duration)
        timeRef.current.textContent = formatTime(currentTime)
        durationRef.current.textContent = formatTime(duration)
        setIsLoading(false)
    }

    const updateProgress = () => {
        const time = audioRef.current.currentTime
        progressRef.current.value = time
        timeRef.current.textContent = formatTime(time)
    }

    const updateVolumeBar = () =>
        volumeRef.current.value = audioRef.current.volume

    const getProgressPosition = (e, el) => 
        (e.pageX - (el.offsetLeft + el.offsetParent.offsetLeft)) / el.offsetWidth

    const handleProgressClick = (e) => {
        const aeEl = audioRef.current
        const prEl = progressRef.current
        aeEl.currentTime = getProgressPosition(e, prEl) * aeEl.duration
    }

    const handleVolumeChange = (e) => {
        const prEl = volumeRef.current
        const val = getProgressPosition(e, prEl)
        setVolume(val)
        saveVolume(val)
    }

    const handlePlay = () => setIsPlaying(true)

    const setBookPosition = () =>
        book.ps = audioRef.current.currentTime

    const setBookIsCompleted = () => {
        book.ps = audioRef.current.duration
        book.cm = true
    }

    const handlePause = () => {
        setIsPlaying(false)
        setBookPosition()
        return updateBook(book)
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setBookIsCompleted()
        return updateBook(book, true)
    }

    const setVolume = (volume) => audioRef.current.volume = volume

    const saveVolume = afterIdle((volume) => {
        localStorage.setItem(LS_ITEM_VOLUME, volume)
    }, 1000)

    const openLibrary = async () => {
        if (isPlaying) {
            setIsLoading(true)
            await handlePause()
        }
        goHome()
    }

    return (
        <>
            <div className="top-bar big-title">
                <div className='book-title' onClick={openLibrary}>
                    {getNameNoExt(book.fl)}
                </div>
                <button className="home-btn" onClick={openLibrary}>
                    <FaList />
                </button>
            </div>
            {isLoading && <LoadingSpinner />}
            <audio 
                src={'media/' + book.id} type="audio/mpeg" 
                autoPlay={autoStart}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={updateProgress}
                onVolumeChange={updateVolumeBar}
                ref={audioRef}
            />
            <div className="player-row">
                <div className='play-and-time'>
                    <div className="play-pause-btns">
                        {isPlaying 
                            ? <button onClick={pause} className="play-pause-btn">
                                <BsPauseBtn />
                            </button>
                            : <button onClick={play} className="play-pause-btn">
                                <BsPlayBtn />
                            </button>
                        }
                    </div>
                    <div className="time-bar" ref={timeRef} />
                </div>
                <div className="book-info">
                    <ul>
                        {bookMeta?.albumartist && 
                            <li className="book-artist">
                                {bookMeta.albumartist}
                            </li>
                        }
                        {bookMeta?.artist && 
                            <li className="book-artist">
                                {bookMeta.artist}</li>
                            }
                        {bookMeta?.album && 
                            <li>
                                {bookMeta.album}
                            </li>
                        }
                        {bookMeta?.title && 
                            <li>
                                {bookMeta.title}
                            </li>
                        }
                        {bookMeta?.year && 
                            <li>
                                {bookMeta.year}
                            </li>
                        }
                        <li ref={durationRef} />
                    </ul>
                </div>
                {bookMeta?.imgSrc && <img 
                    src={bookMeta?.imgSrc} 
                    alt="book cover" 
                    className="book-cover" 
                />}
            </div>
            <div className='progress-container'>
                <ImClock />
                <progress 
                    className="progress-bar" 
                    value="0" 
                    min="0" 
                    ref={progressRef} 
                    onClick={handleProgressClick}
                />
            </div>
            <div className='volume-container'>
                <BiVolumeFull />
                <progress 
                    className="volume-bar" 
                    value={DEFAULT_VOLUME}
                    min="0" 
                    max="1"
                    ref={volumeRef} 
                    onClick={handleVolumeChange}
                />
            </div>
        </>
    )
}

export default BookPlayer
