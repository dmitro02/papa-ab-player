import { useState, useRef } from 'react'
import { FaList } from 'react-icons/fa';
import { BsPlayBtn } from 'react-icons/bs';
import { BsPauseBtn } from 'react-icons/bs';
import { BiVolumeFull } from 'react-icons/bi';
import { getBookTitle, formatTime } from '../utils'

const DEFAULT_VOLUME = 0.5

const BookPlayer = ({ book, goHome }) => {
    const [ isPlaying, setIsPlaying ] = useState(false)

    const audioRef = useRef()
    const progressRef = useRef()
    const timeRef = useRef()

    const play = async () => {
        await audioRef.current.play()
        setIsPlaying(true)
    }

    const pause = async () => {
        await audioRef.current.pause()
        setIsPlaying(false)
    }

    const handleLoadedMetadata = () => {
        progressRef.current.setAttribute('max', audioRef.current.duration)
        timeRef.current.textContent = formatTime(audioRef.current.currentTime)
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

    return (
        <div className="book-player">
            <div className="top-bar">
                <div className='book-title' onClick={goHome}>{getBookTitle(book)}</div>
                <button className="home-btn" onClick={goHome}><FaList size={80} /></button>
            </div>
            <audio 
                ref={audioRef} 
                src={book} type="audio/mpeg" 
                onPlay={() => console.log('play')}
                onPause={() => console.log('pause')}
                onEnded={() => console.log('ended')}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={updateProgress}
            />
            <div className="play-pause-btns">
                {isPlaying 
                    ? <button onClick={pause}><BsPauseBtn size={280} /></button>
                    : <button onClick={play}><BsPlayBtn size={280} /></button>
                }
            </div>
            <div className="time-indicator" ref={timeRef}>00:00:00</div>
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
                />
            </div>
        </div>
    )
}

export default BookPlayer
