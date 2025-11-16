import React from 'react'
import styles from './styles.module.scss'
import { UIContainer } from '../ui-container'

export const UIFonts: React.FC = () => {
  return (
    <UIContainer
      title="Fonts"
      description="Проверка установки шрифтов"
      props={[]}
      components={
        <div>
        <span className={styles.text}>Пример текста системный шрифт</span>
        <br/>
        <span className={styles.interRegular}>Пример текста Inter-Regular</span>
    </div>
    
      }
    />
  )


}
