import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import styles from '../styles/styles.module.scss'
import clsx from 'clsx'
import type { QRCodeProps } from '../types/types'

const QRCode: React.FC<QRCodeProps> = ({
  url,
  className,
  size,
  errorCorrectionLevel = 'M',
  fgColor = '#000000',
  bgColor = '#ffffff',
  ...props
}) => {
  return (
    <div className={clsx(styles.qrCodeWrapper, className)} {...props}>
      <QRCodeSVG
        value={url}
        size={size || 256} // Default size, will be scaled by CSS to 100%
        level={errorCorrectionLevel}
        fgColor={fgColor}
        bgColor={bgColor}
        className={styles.qrCode}
      />
    </div>
  )
}

export { QRCode }

