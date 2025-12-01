import { useState, type SyntheticEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { appRoutesURL } from "../router/app-routes-URL";
import styles from "./app-header.module.scss";
import { useSelector, useDispatch } from "../store/store";
import { getUser, logout, resetAuth } from "../../features/auth/store/auth-slice";
import { AppHeaderUI, ButtonType } from "../../shared/ui/app-header-UI/app-header-UI";
import { ModalWindow } from "../../shared/ui/modal-window/modal-window";
import { Button } from "../../shared/ui/button";
import clsx from "clsx";

/**
 * Компонент header приложения (меню)
 */
export const AppHeader = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate=useNavigate();
  const menu = [
    { name: "Мои вещи", link: appRoutesURL.things, dataCy: "things-menu", needAuth:true },
    { name: "Мои диалоги", link: appRoutesURL.messages, dataCy: "messages-menu" , needAuth:false},
  ];

  const currentUser = useSelector((state) => state.auth.currentUser);

  const menuAction= (path:string) =>{
    setOpen(false);
    navigate(path)
  }

  const handleLogout =()=>{
    if (currentUser)
      dispatch(logout());  
  }

  useEffect(() => {
    dispatch(getUser());
  }, []);
  
 // return <div>***</div>

  if (!isOpen)
    return <AppHeaderUI
       buttonType={ButtonType.burger} 
       homeURL={appRoutesURL.home} 
       closeMenu={()=>setOpen(true)}
    />

  return <ModalWindow>
    <AppHeaderUI
       buttonType={ButtonType.close} 
       homeURL={appRoutesURL.home} 
       closeMenu={()=>setOpen(false)}
    />
    <section className={styles.modal_main_app}>
      {currentUser && <p>Вы вошли как {currentUser.name}</p>}
      <ul className={styles.menu}>
      {menu.map((el,cnt)=>
        { if (!el.needAuth || currentUser)
          return <li key={cnt}>
            <button 
              className={styles.menuAction}
              onClick={()=>menuAction(el.link)}
            >
              {el.name}
            </button>
          </li>
        }
      )}
      {currentUser ? 
        <div className={styles.lastButton}>
          <Button onClick={handleLogout} >Выйти из профиля</Button>
        </div>
        :<li key={menu.length}>
            <button className={styles.menuAction}  onClick={(_)=>{
              dispatch(resetAuth());
              menuAction(appRoutesURL.auth)
            }}>Авторизация
            </button>
          </li>}
      </ul>
    </section>
  </ModalWindow>

};
