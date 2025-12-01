import React from 'react'
import { UIContainer } from '../ui-container'
import { Button } from '../../../../shared/ui/button'
import styles from './styles.module.scss'

export const UIButton: React.FC = () => {
  return (
    <UIContainer
      title="Button"
      description="Кнопка со всеми стандартными props и дополнительными:"
      props={[
        { key: 'children', value: 'Содержимое кнопки (текст, HTML-элементы и т.д.)' }
      ]}
      components={
        <div className={styles.container}>
          <Button onClick={()=>console.log('войти')}  >
          Войти
          </Button>
          <Button >
          Регистрация через Telegram
          </Button>

        </div>
      }
    />
  )
}
