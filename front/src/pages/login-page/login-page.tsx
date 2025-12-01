import { type SyntheticEvent, useEffect } from "react";
import { useForm } from "../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../app/store/store";
import {
  setStatus,
  login,
  logout,
  resetStatus,
  AuthStatus,
  selectCurrentUser,
  selectSliceStatus,
  selectCurrentLogin,
  selectError,
} from "../../features/auth/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { appRoutesURL, telegramBotURL } from "../../app/router/app-routes-URL";
import { type UserInner } from "../../features/auth/user-types";
import { LoginForm } from "../../shared/ui/login-form/login-form";

const emptyUser: UserInner = {
  name: "",
  password: "",
};

export default function LoginPage() {
  const { values, handleChange, setValues, getFormDTOObl } =
    useForm<UserInner>(emptyUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sliceStatus = useSelector(selectSliceStatus);
  const currentUser = useSelector(selectCurrentUser);
  const currentLogin = useSelector(selectCurrentLogin);
  const error = useSelector(selectError);

  const resetError = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetStatus());
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    // Используем window.console.log для обхода возможного переопределения
    window.console.log('LoginPage handleSubmit',getFormDTOObl());
    e.preventDefault();
    if (currentUser) {
      dispatch(logout());
    } 
    else     dispatch(login({ ...getFormDTOObl() }));
  };

  useEffect(() => {
    if (sliceStatus === AuthStatus.Success) {
      if (currentLogin) {
        setValues(emptyUser); // сброс логина-пароля на странице логина
        dispatch(setStatus(AuthStatus.Idle));
        navigate(appRoutesURL.home);
      }
    }
  }, [sliceStatus, currentUser]);

  return (
    <LoginForm
      telegramBotURL={telegramBotURL}
      values={values}
      resetError={resetError}
      error={error}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
    />
  );
}

/*status={sliceStatus}
currentUser={currentUser}
*/
