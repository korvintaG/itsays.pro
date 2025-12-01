import {type FC, type SyntheticEvent} from 'react';
import type { HTMLEditElement } from '../../types/types-for-hooks';
import { Input } from '../input';
import { Button } from '../button';
import styles from './login-form.module.scss'
import type { LoginData } from '../../types/entity-types';

export type LoginFormProps = {
    values: LoginData;
    telegramBotURL: string;
    handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    handleChange: (event: React.ChangeEvent<HTMLEditElement>) => void;
    error?: string;
    resetError: (e: SyntheticEvent) => void;
}

export const LoginForm : FC<LoginFormProps> =(props: LoginFormProps)=> {
    return <form onSubmit={props.handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Вход в профиль</h1>
        <div className={styles.inputs}>
          <Input 
            multiline={false}
            name="name"
            value={props.values.name} 
            label='логин'
            onChange={props.handleChange} />
          <Input 
            multiline={false}
            name="password"
            value={props.values.password} 
            label='пароль'
            type='password'
            onChange={props.handleChange} />
          {props.error && <p className={styles.error}>{props.error}</p>}
          <a href={props.telegramBotURL} className={styles.forgot} >Забыли пароль?</a>
        </div>          
        <div className={styles.buttons}>  
          <Button>Войти</Button>
          <Button 
            onClick={(e: React.MouseEvent<HTMLButtonElement>)=>
              {
                e.preventDefault();
                window.location.href = props.telegramBotURL
              }
              } >
              Регистрация через Телеграм
          </Button>
        </div>
    </form>
}