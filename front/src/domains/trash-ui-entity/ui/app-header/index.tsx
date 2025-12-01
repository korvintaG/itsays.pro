import React from 'react'
import { UIContainer } from '../ui-container'
import { Button } from '../../../../shared/ui/button'
import styles from './styles.module.scss'
import { AppHeaderUI, ButtonType } from '../../../../shared/ui/app-header-UI/app-header-UI'
import { appRoutesURL } from '../../../../app/router/app-routes-URL'

export const UIAppHeader: React.FC = () => {
  return (
    <UIContainer
      title="AppHeader"
      description="Заголовок приложения:"
      props={[
        { key: 'children', value: 'Содержимое кнопки справа (текст, HTML-элементы и т.д.)' }
      ]}
      components={
        <div className={styles.container}>
          <AppHeaderUI 
            buttonType={ButtonType.burger} 
            homeURL={appRoutesURL.home} 
            closeMenu={()=>{}}/>
          <AppHeaderUI 
            buttonType={ButtonType.close} 
            homeURL={appRoutesURL.home} 
            closeMenu={()=>{}}/>
        </div>
      }
    />
  )
}
