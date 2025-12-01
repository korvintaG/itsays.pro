import React, { useState } from 'react'
import { UIContainer } from '../ui-container'
import { Button } from '../../../../shared/ui/button'
import styles from './styles.module.scss'
import { ModalWindow } from '../../../../shared/ui/modal-window/modal-window'
import { LoginForm } from '../../../../shared/ui/login-form/login-form'
import { useForm } from '../../../../shared/hooks/useForm'
import { telegramBotURL } from '../../../../app/router/app-routes-URL'
import type { LoginData } from '../../../../shared/types/entity-types'

export const UILoginForm: React.FC = () => {
  const { values, handleChange, setValues, getFormDTOObl } =
    useForm<LoginData>({name:'', password:''});

  const [error, setError] = useState<string>('');


  return (
    <UIContainer
      title="LoginForm"
      description="Форма Логина"
      props={[
        { key: 'values', value: 'поля формы' },
        { key: 'handleSubmit', value: '(e: SyntheticEvent<HTMLFormElement>) => void - обработчик сабмита' },
        { key: 'handleChange', value: '(event: React.ChangeEvent<HTMLEditElement>) => void - обработчик нажатий клавиши' },
        { key: 'error', value: 'текст ошибки' },
        { key: 'resetError', value: 'функция сброса ошибки' },
      ]}
      components={
        <div className={styles.container}>
          <LoginForm
            telegramBotURL={telegramBotURL}
            values={values}
            handleSubmit={()=>{}}
            handleChange={handleChange}
            error={error}
            resetError={()=>setError('')}
          />
        </div>
      }
    />
  )
}
