import React, { useState } from 'react'
import { UIContainer } from '../ui-container'
import styles from './styles.module.scss'
import { TakePhoto } from '../../../../shared/ui/take-photo'
import { ConsoleLogInterceptor } from '../../../../shared/ui/console-log-interceptor'

export const UITakePhoto: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoName, setPhotoName] = useState<string>('')

  const handlePhotoTaken = (photo: File) => {
    setPhotoName(photo.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(photo)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    setPhotoName('')
  }

  return (
    <UIContainer
      title="TakePhoto"
      description="Компонент для съёмки фото с камеры устройства. По запросу пользователя делает стандартное фото используя камеру коммуникатора/планшета."
      props={[
        { key: 'onPhotoTaken', value: 'Callback при успешном снимке (photo: File) => void' },
        { key: 'onCancel', value: 'Callback при отмене () => void' },
        { key: 'disabled', value: 'Отключить компонент (boolean)' },
        { key: 'size', value: 'Размер кнопки: "small" | "medium" | "large"' }
      ]}
      components={
        <div className={styles.container}>
          <div className={styles.demoSection}>
            <h3>Компонент TakePhoto:</h3>
            <TakePhoto size="medium" onPhotoTaken={handlePhotoTaken} />
          </div>

          {photoPreview && (
            <div className={styles.demoSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3>Сделанное фото:</h3>
                <button 
                  onClick={clearPhoto}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                    cursor: 'pointer'
                  }}
                >
                  Очистить
                </button>
              </div>
              <div className={styles.photoPreview}>
                <img src={photoPreview} alt="Preview" />
                <p>Имя файла: {photoName}</p>
              </div>
            </div>
          )}

          <div className={styles.demoSection}>
            <ConsoleLogInterceptor />
          </div>
        </div>
      }
    />
  )
}

