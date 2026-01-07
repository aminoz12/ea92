import { useRef, useState, useEffect } from 'react'

export interface VideoOptimizerProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  onLoadStart?: () => void
  onCanPlay?: () => void
  onError?: () => void
  onLoadedData?: () => void
}

export function VideoOptimizer({
  src,
  poster,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoadStart,
  onCanPlay,
  onError,
  onLoadedData
}: VideoOptimizerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const videoElement = videoRef.current
    if (videoElement) {
      observer.observe(videoElement)
    }

    return () => observer.disconnect()
  }, [])

  // Optimize video playback
  useEffect(() => {
    if (videoRef.current && isVisible) {
      const video = videoRef.current
      
      // Set playback rate for faster loading
      video.playbackRate = 1.0
      
      // Optimize buffering
      video.preload = 'metadata'
      
      // Enable hardware acceleration
      video.style.willChange = 'transform'
    }
  }, [isVisible])

  const handleLoadStart = () => {
    onLoadStart?.()
  }

  const handleCanPlay = () => {
    setIsLoaded(true)
    onCanPlay?.()
  }

  const handleError = () => {
    console.error('Video failed to load')
    onError?.()
  }

  const handleLoadedData = () => {
    onLoadedData?.()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          style={{ backgroundImage: poster ? `url(${poster})` : undefined }}
        />
      )}
      
      {/* Video */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay={autoPlay && isVisible}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={isVisible ? 'metadata' : 'none'}
        poster={poster}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadedData={handleLoadedData}
        crossOrigin="anonymous"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
