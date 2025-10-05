import { useState, useEffect } from 'react'

interface ProgressiveImageProps {
  src: string
  webpSrc?: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  placeholder?: string
}

export function ProgressiveImage({ 
  src, 
  webpSrc, 
  alt, 
  className = '', 
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA2VjE4TTYgMTJIMThNMTIgNkw2IDEyTDEyIDE4TDE4IDEyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
}: ProgressiveImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    
    img.onerror = () => {
      setHasError(true)
      // Fallback to original src if WebP fails
      if (webpSrc && src !== webpSrc) {
        const fallbackImg = new Image()
        fallbackImg.onload = () => {
          setImageSrc(src)
          setIsLoaded(true)
        }
        fallbackImg.src = src
      }
    }
    
    // Try WebP first if available, otherwise use original
    img.src = webpSrc || src
  }, [src, webpSrc])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'opacity-100' : ''}`}
        style={{
          filter: isLoaded ? 'none' : 'blur(5px)',
        }}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  )
}
