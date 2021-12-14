const BookPlayer = ({ book, goHome }) => {
    const renderProgressBar = () => {
        const audio = document.getElementsByTagName('audio')[0]
        const bar = document.querySelector('.progress-bar')
        const maxWidth = 500
        const k = Math.floor(maxWidth / audio.duration)
        const newWidth = Math.floor(audio.currentTime * k) + 'px'
        bar.style.width = newWidth
    }

    return (
        <div className="book-player">
            <div className="button" onClick={goHome}>HOME</div>
            <audio 
                controls 
                src={book} type="audio/mpeg" 
                onPlay={() => console.log('play')}
                onPause={() => console.log('pause')}
                onEnded={() => console.log('ended')}
                onTimeUpdate={renderProgressBar}
            />
            <div className="progress-bar" />
        </div>
        
    )
}

export default BookPlayer
