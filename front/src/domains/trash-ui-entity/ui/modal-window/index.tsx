import React, { useState } from 'react'
import { UIContainer } from '../ui-container'
import { Button } from '../../../../shared/ui/button'
import styles from './styles.module.scss'
import { ModalWindow } from '../../../../shared/ui/modal-window/modal-window'

export const UIModalWindow: React.FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <UIContainer
      title="ModalWIndow"
      description="Контейнер модального окна с props и дополнительными:"
      props={[
        { key: 'children', value: 'Содержимое модального окна (текст, HTML-элементы и т.д.)' }
      ]}
      components={
        <div className={styles.container}>
          <Button onClick={()=>setOpen(true)}  >
          Открыть модальное
          </Button>
          {isOpen && <ModalWindow>
            <Button onClick={()=>setOpen(false)} >Закрыть</Button>
          </ModalWindow>}

        </div>
      }
    />
  )
}
