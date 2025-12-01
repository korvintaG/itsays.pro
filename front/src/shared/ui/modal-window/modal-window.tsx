import {type FC} from 'react'
import styles from './modal-windows.module.scss'

export type ModalWindowProps = {
    children?: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
  
export const ModalWindow : FC<ModalWindowProps> = ({children})=>{
    return <section className={styles.container}>
        <div className={styles.subcontainer}>
            {children}
        </div>
    </section>
}