import { type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import styles from './app-header-UI.module.scss'

export const enum ButtonType  {
    burger=1,
    close=2
}

export type AppHeaderUIProps = {
    homeURL: string,
    closeMenu: () => void,
    buttonType: ButtonType
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const AppHeaderUI : FC<AppHeaderUIProps> = 
({homeURL, closeMenu, buttonType}) => {
  const navigate = useNavigate();
  return <header className={styles.container}>
    <button className={styles.icon} 
      onClick={()=>{
      closeMenu();
      navigate(homeURL)
    }}>ItSays</button>
    <button className={styles.icon} onClick={()=>closeMenu()}>
      {buttonType===ButtonType.burger?<Bars3Icon/>
        :<XMarkIcon/>}
    </button>
  </header>;
};