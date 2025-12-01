import React, { useState } from 'react'
import { UIContainer } from '../ui-container'
import styles from './styles.module.scss'
import { QRCode } from '../../../../shared/ui/qr-code'

export const UIQRCode: React.FC = () => {
  const [url, setUrl] = useState<string>('https://example.com')

  return (
    <UIContainer
      title="QRCode"
      description="Компонент для генерации QR-кода по заданной строке. Занимает 100% текущего контейнера."
      props={[
        { key: 'url', value: 'URL или строка для генерации QR-кода (обязательно, string)' },
        { key: 'size', value: 'Размер QR-кода в пикселях (опционально, number)' },
        { key: 'errorCorrectionLevel', value: 'Уровень коррекции ошибок: "L" | "M" | "Q" | "H" (по умолчанию "M")' },
        { key: 'fgColor', value: 'Цвет переднего плана (по умолчанию "#000000")' },
        { key: 'bgColor', value: 'Цвет фона (по умолчанию "#ffffff")' }
      ]}
      components={
        <div className={styles.container}>
          <div className={styles.demoSection}>
            <h3>Введите URL для генерации QR-кода:</h3>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={styles.urlInput}
            />
          </div>

          <div className={styles.demoSection}>
            <h3>QR-код (100% контейнера):</h3>
            <div className={styles.qrCodeContainer}>
              <QRCode url={url} />
            </div>
          </div>

          <div className={styles.demoSection}>
            <h3>QR-код с кастомными цветами:</h3>
            <div className={styles.qrCodeContainer}>
              <QRCode 
                url={url} 
                fgColor="#0066cc"
                bgColor="#f0f0f0"
              />
            </div>
          </div>

          <div className={styles.demoSection}>
            <h3>QR-код фиксированного размера (200px):</h3>
            <div className={styles.qrCodeFixedSize}>
              <QRCode url={url} size={200} />
            </div>
          </div>
        </div>
      }
    />
  )
}

