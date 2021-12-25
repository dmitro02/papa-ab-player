import { useState, useRef, useEffect } from 'react'
import { FaList } from 'react-icons/fa'
import { BsPlayBtn, BsPauseBtn } from 'react-icons/bs'
import { BiVolumeFull } from 'react-icons/bi'
import { getNameNoExt, formatTime, afterIdle } from '../utils'
import LoadingSpinner from './LoadingSpinner'
import { updateBook } from '../bookService'

const DEFAULT_VOLUME = 0.3
const LS_ITEM_VOLUME = 'papaAbPlayer.volume'

const BookPlayer = ({ book, goHome, autoStart }) => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const volume = 
            parseFloat(localStorage.getItem(LS_ITEM_VOLUME)) 
            || DEFAULT_VOLUME
        setVolume(volume)
        volumeRef.current.value = volume

        audioRef.current.currentTime = book.ps
    }, [])

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
        durationRef.current.textContent = '/' + formatTime(duration)
        setIsLoading(false)
    }

    const updateProgress = () => {
        const time = audioRef.current.currentTime
        progressRef.current.value = time
        timeRef.current.textContent = formatTime(time)
    }

    const handleProgressClick = (e) => {
        const aeEl = audioRef.current
        const prEl = progressRef.current
        const pos = 
            (e.pageX - (prEl.offsetLeft + prEl.offsetParent.offsetLeft)) / prEl.offsetWidth
        aeEl.currentTime = pos * aeEl.duration
    }

    const handleVolumeChange = (e) => {
        const val = e.target.value
        setVolume(val)
        saveVolume(val)
    }

    const handlePlay = () => setIsPlaying(true)

    const setBookPosition = () => {
        book.ps = audioRef.current.currentTime
        return updateBook(book)
    }

    const setBookIsCompleted = () => {
        book.ps = audioRef.current.duration
        book.cm = true
        return updateBook(book)
    }

    const handlePause = () => {
        setIsPlaying(false)
        setBookPosition()
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setBookIsCompleted()
    }

    const setVolume = (volume) => audioRef.current.volume = volume

    const saveVolume = afterIdle((volume) => {
        localStorage.setItem(LS_ITEM_VOLUME, volume)
    }, 1000)

    const openLibrary = async () => {
        setIsLoading(true)
        await setBookPosition()
        goHome()
    }

    return (
        <>
            <div className="top-bar big-title">
                <div className='book-title' onClick={openLibrary}>{getNameNoExt(book.fl)}</div>
                <button className="home-btn" onClick={openLibrary}><FaList size={80} /></button>
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
                ref={audioRef}
            />
            <div className="play-pause-btns">
                {isPlaying 
                    ? <button onClick={pause}><BsPauseBtn size={280} /></button>
                    : <button onClick={play}><BsPlayBtn size={280} /></button>
                }
            </div>
            <div className="time-bar">
                <span ref={timeRef} />
                <span ref={durationRef}/>
            </div>
            <progress 
                className="progress-bar" 
                value="0" 
                min="0" 
                ref={progressRef} 
                onClick={handleProgressClick}
            />
            <div className='volume-container'>
                <BiVolumeFull size={200} />
                <input 
                    type="range" 
                    id="volume" 
                    name="volume"
                    min="0" 
                    max="1"
                    step="0.01"
                    defaultValue={DEFAULT_VOLUME}
                    onChange={handleVolumeChange}
                    ref={volumeRef}
                />
            </div>
        </>
    )
}

export default BookPlayer
