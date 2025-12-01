import type { HTMLAttributes } from 'react'

export type TakePhotoProps = {
  /** Callback when photo is taken. Receives the photo file. */
  onPhotoTaken?: (photo: File) => void
  /** Callback when photo capture is cancelled */
  onCancel?: () => void
  /** Additional CSS class name */
  className?: string
  /** Disable the component */
  disabled?: boolean
  /** Button size */
  size?: 'small' | 'medium' | 'large'
} & HTMLAttributes<HTMLDivElement>

