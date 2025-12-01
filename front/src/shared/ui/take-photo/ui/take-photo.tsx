import React, { useRef, useState, useCallback } from 'react'
import styles from '../styles/styles.module.scss'
import clsx from 'clsx'
import type { TakePhotoProps } from '../types/types'

const TakePhoto: React.FC<TakePhotoProps> = ({
  onPhotoTaken,
  onCancel,
  className,
  disabled = false,
  size = 'medium',
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null) // For camera capture
  const fileSelectInputRef = useRef<HTMLInputElement>(null) // For file selection
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputId = React.useId()
  const fileSelectInputId = React.useId()

  // Helper function to get camera stream with support for old browsers
  const getUserMedia = useCallback((constraints: MediaStreamConstraints): Promise<MediaStream> => {
    // Modern API (Chrome 53+, Firefox 36+, Safari 11+)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints)
    }

    // Legacy API with prefixes for older browsers
    const getUserMediaLegacy = 
      (navigator as any).getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).msGetUserMedia

    if (getUserMediaLegacy) {
      return new Promise((resolve, reject) => {
        getUserMediaLegacy.call(navigator, constraints, resolve, reject)
      })
    }

    return Promise.reject(new Error('getUserMedia is not supported in this browser'))
  }, [])

  // Helper to check if getUserMedia is available (checked dynamically)
  const checkMediaDevicesSupported = useCallback(() => {
    if (typeof navigator === 'undefined') {
      console.log('TakePhoto: navigator is undefined')
      return false
    }
    
    const hasModern = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'
    const hasLegacy = !!(navigator as any).getUserMedia || 
                      !!(navigator as any).webkitGetUserMedia || 
                      !!(navigator as any).mozGetUserMedia || 
                      !!(navigator as any).msGetUserMedia
    
    const supported = hasModern || hasLegacy
    
    console.log('TakePhoto: MediaDevices support check:', {
      hasModern,
      hasLegacy,
      supported,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia
    })
    
    return supported
  }, [])

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    console.log('TakePhoto: handleButtonClick START', { 
      disabled, 
      isMenuOpen,
      type: e.type,
      timestamp: Date.now()
    })
    
    if (disabled) {
      console.log('TakePhoto: Button is disabled, returning')
      return
    }
    
    const newState = !isMenuOpen
    console.log('TakePhoto: Setting menu open to', newState)
    setIsMenuOpen(newState)
    console.log('TakePhoto: handleButtonClick END')
  }, [disabled, isMenuOpen])

  const handleTakePhoto = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    console.log('TakePhoto: handleTakePhoto called')
    setIsMenuOpen(false)

    // Small delay to ensure menu is closed before opening camera
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if MediaDevices API is available
    const hasMediaDevices = typeof navigator !== 'undefined' && 
                           navigator.mediaDevices && 
                           typeof navigator.mediaDevices.getUserMedia === 'function'
    
    // Check for legacy API
    const hasLegacyAPI = typeof navigator !== 'undefined' && (
      !!(navigator as any).getUserMedia ||
      !!(navigator as any).webkitGetUserMedia ||
      !!(navigator as any).mozGetUserMedia
    )
    
    console.log('TakePhoto: MediaDevices available:', hasMediaDevices)
    console.log('TakePhoto: Legacy API available:', hasLegacyAPI)
    
    // If neither API is available, use file input
    if (!hasMediaDevices && !hasLegacyAPI) {
      console.log('TakePhoto: No camera API available, using file input with capture')
      setTimeout(() => {
        if (fileInputRef.current) {
          console.log('TakePhoto: Clicking file input with capture')
          fileInputRef.current.click()
        } else {
          console.error('TakePhoto: fileInputRef.current is null')
        }
      }, 100)
      return
    }

    // Try to get camera stream via MediaDevices API
    console.log('TakePhoto: Trying to access camera via MediaDevices API')
    
    // Try different camera configurations for better compatibility
    const cameraConfigs = [
      // First, try to get any available camera (best for webcams on Windows)
      { video: true, audio: false },
      // Then try user-facing camera (front camera/webcam)
      { video: { facingMode: 'user' }, audio: false },
      // Finally try environment-facing (back camera on mobile)
      { video: { facingMode: 'environment' }, audio: false }
    ]

    let stream: MediaStream | null = null
    let lastError: any = null

    // Try to get camera stream
    for (const config of cameraConfigs) {
      try {
        console.log('TakePhoto: Trying camera config:', JSON.stringify(config))
        stream = await navigator.mediaDevices.getUserMedia(config)
        console.log('TakePhoto: Camera stream obtained successfully!', stream)
        break
      } catch (error: any) {
        console.warn('TakePhoto: Camera config failed:', config, {
          message: error?.message,
          name: error?.name
        })
        lastError = error
        continue
      }
    }

    if (stream) {
      streamRef.current = stream
      setIsCameraActive(true)
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          if ('srcObject' in videoRef.current) {
            videoRef.current.srcObject = stream
          } else if ('webkitSrcObject' in videoRef.current) {
            (videoRef.current as any).webkitSrcObject = stream
          }
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err)
          })
        }
      }, 100)
    } else {
      console.error('TakePhoto: All camera configs failed, last error:', lastError)
      // Fallback to file input with capture
      console.log('TakePhoto: Falling back to file input with capture')
      setTimeout(() => {
        if (fileInputRef.current) {
          console.log('TakePhoto: Clicking file input with capture')
          fileInputRef.current.click()
        } else {
          console.error('TakePhoto: fileInputRef.current is null')
        }
      }, 100)
    }
  }, [disabled, getUserMedia])

  const handleSelectPhoto = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    console.log('TakePhoto: handleSelectPhoto called')
    setIsMenuOpen(false)

    // Small delay to ensure menu is closed before opening file picker
    setTimeout(() => {
      if (fileSelectInputRef.current) {
        console.log('TakePhoto: Clicking file select input')
        fileSelectInputRef.current.click()
      } else {
        console.error('TakePhoto: fileSelectInputRef.current is null')
      }
    }, 100)
  }, [disabled])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('TakePhoto: handleFileChange called', e.target.files)
      const file = e.target.files?.[0]
      if (file && onPhotoTaken) {
        console.log('TakePhoto: File selected:', file.name, file.size, file.type)
        onPhotoTaken(file)
      }
      // Reset input to allow selecting the same file again
      if (e.target === fileInputRef.current && fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (e.target === fileSelectInputRef.current && fileSelectInputRef.current) {
        fileSelectInputRef.current.value = ''
      }
    },
    [onPhotoTaken],
  )

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0)

    // Convert canvas to blob and then to File
    canvas.toBlob((blob) => {
      if (blob && onPhotoTaken) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        onPhotoTaken(file)
      }
    }, 'image/jpeg', 0.95)

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      // Clear both modern and legacy video source
      if ('srcObject' in videoRef.current) {
        videoRef.current.srcObject = null
      } else if ('webkitSrcObject' in videoRef.current) {
        (videoRef.current as any).webkitSrcObject = null
      }
    }
    setIsCameraActive(false)
  }, [onPhotoTaken])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      // Clear both modern and legacy video source
      if ('srcObject' in videoRef.current) {
        videoRef.current.srcObject = null
      } else if ('webkitSrcObject' in videoRef.current) {
        (videoRef.current as any).webkitSrcObject = null
      }
    }
    setIsCameraActive(false)
  }, [])

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log('TakePhoto: Component mounted', { disabled, size })
    
    // Test: Add direct event listener to button
    const button = document.querySelector(`[aria-label="Открыть меню"]`) as HTMLButtonElement
    if (button) {
      console.log('TakePhoto: Found button element, adding test listener')
      const testHandler = (e: Event) => {
        console.log('TakePhoto: DIRECT EVENT LISTENER FIRED!', e.type, e.target)
      }
      button.addEventListener('click', testHandler, true)
      button.addEventListener('touchend', testHandler, true)
      button.addEventListener('touchstart', testHandler, true)
      
      return () => {
        button.removeEventListener('click', testHandler, true)
        button.removeEventListener('touchend', testHandler, true)
        button.removeEventListener('touchstart', testHandler, true)
      }
    } else {
      console.log('TakePhoto: Button element not found!')
    }
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      // Use both mousedown and touchstart for better mobile support
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <>
      <div 
        className={clsx(styles.takePhotoWrapper, className)} 
        {...props}
      >
        <button
          type="button"
          className={clsx(styles.takePhotoButton, styles[size], disabled && styles.disabled)}
          onClick={(e) => {
            console.log('TakePhoto: onClick event fired', e.type)
            handleButtonClick(e)
          }}
          onTouchEnd={(e) => {
            console.log('TakePhoto: onTouchEnd event fired', e.type)
            e.preventDefault()
            handleButtonClick(e)
          }}
          disabled={disabled || isCameraActive}
          aria-label="Открыть меню"
        >
          <span className={styles.plusIcon}>+</span>
        </button>

        {isMenuOpen && !isCameraActive && (
          <div ref={menuRef} className={styles.menu}>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleTakePhoto}
              onTouchEnd={handleTakePhoto}
              aria-label="Сделать снимок"
            >
              Сделать снимок
            </button>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleSelectPhoto}
              onTouchEnd={handleSelectPhoto}
              aria-label="Добавить фотографию"
            >
              Добавить фотографию
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          className={styles.hiddenInput}
          onChange={handleFileChange}
          aria-label="Камера"
        />
        <input
          ref={fileSelectInputRef}
          id={fileSelectInputId}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleFileChange}
          aria-label="Выбрать файл"
        />
      </div>

      {isCameraActive && (
        <div className={styles.cameraOverlay}>
          <div className={styles.cameraContainer}>
            <video
              ref={videoRef}
              className={styles.cameraVideo}
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className={styles.hiddenCanvas} />
            <div className={styles.cameraControls}>
              <button
                type="button"
                className={styles.captureButton}
                onClick={capturePhoto}
                aria-label="Сделать снимок"
              >
                <span className={styles.captureButtonInner} />
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={stopCamera}
                aria-label="Отмена"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { TakePhoto }

