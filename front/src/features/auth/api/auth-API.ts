import { type ServerResponse,  type Success} from '../../../shared/types/types-for-hooks'
import {type LoginResult, type User, } from '../user-types'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 
import type { LoginData } from '../../../shared/types/entity-types';

export const API_URL = import.meta.env.VITE_API_URL!;

// Логируем URL для отладки
if (import.meta.env.DEV) {
  window.console.log('API_URL:', API_URL, 'VITE_API_URL:', import.meta.env.VITE_API_URL);
  if (!import.meta.env.VITE_API_URL) {
    window.console.warn('⚠️ VITE_API_URL не установлена! Создайте файл .env в папке front/ с содержимым: VITE_API_URL=http://localhost:3000/api');
  }
}

export interface IAuthAPI {
  login: (data: LoginData) => Promise<ServerResponse<LoginResult>>;
  getUser: () => Promise<User>;
  logout: () => Promise<Success>;
}

export class AuthAPI extends Api implements IAuthAPI {

  // **********************************************
  // * Авторизация
  // **********************************************
  login = (data: LoginData): Promise<ServerResponse<LoginResult>> => {
    return this.request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  getUser = (): Promise<User> => {
    return this.requestWithRefresh<User>("/auth/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  logout = (): Promise<Success> => {
    return this.request<Success>("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };



}

const authAPI=new AuthAPI(API_URL);
export default authAPI;
