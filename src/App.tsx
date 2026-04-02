import { useEffect, useRef, useState } from 'react'

interface Photo {
  id: string
  dataUrl: string
  timestamp: Date
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const initCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access is not supported in this browser')
        return
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        })

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
        setStream(mediaStream)
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please allow camera access.')
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.')
          } else {
            setError(`Camera error: ${err.message}`)
          }
        }
      }
    }

    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/png')
    const newPhoto: Photo = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date()
    }

    setPhotos(prev => [newPhoto, ...prev])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Camera Photo Capture Demo</h1>
        <p>Capture photos from your camera without changing screens</p>
      </header>

      <div className="main-content">
        <div className="camera-section">
          <div className="video-container">
            {error ? (
              <div className="error-message">
                <p>{error}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="video-feed"
              />
            )}
          </div>
          <button
            onClick={capturePhoto}
            disabled={!stream || !!error}
            className="capture-button"
          >
            Take Photo
          </button>
        </div>

        <div className="gallery-section">
          <h2>Captured Photos ({photos.length})</h2>
          {photos.length === 0 ? (
            <p className="empty-state">No photos captured yet. Click "Take Photo" to start!</p>
          ) : (
            <div className="photo-grid">
              {photos.map(photo => (
                <div key={photo.id} className="photo-card">
                  <img src={photo.dataUrl} alt={`Captured at ${formatTime(photo.timestamp)}`} />
                  <div className="photo-timestamp">{formatTime(photo.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default App
