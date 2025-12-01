import type { HTMLAttributes } from 'react'

export type QRCodeProps = {
  /** URL или строка для генерации QR-кода (обязательно) */
  url: string
  /** Дополнительный CSS класс */
  className?: string
  /** Размер QR-кода в пикселях (если не указан, занимает 100% контейнера) */
  size?: number
  /** Уровень коррекции ошибок: 'L' | 'M' | 'Q' | 'H' */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  /** Цвет переднего плана (QR-код) */
  fgColor?: string
  /** Цвет фона */
  bgColor?: string
} & HTMLAttributes<HTMLDivElement>

