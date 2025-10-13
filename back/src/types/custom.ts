export interface SimpleEntity {
  id: number;
  name: string;
}

export interface SimpleEntityWithCnt extends SimpleEntity {
  cnt: number;
}

export interface IModerate {
  action: 'approve' | 'reject';
  notes?: string;
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  id: number;
  name: string;
};

export const enum Role {
  User = 0,
  Admin = 1,
  //Blocked = 2,
  SuperAdmin = 3,
}

export interface IUser extends SimpleEntity {
  role_id: Role;
}


/*
- 201: создание нового ресурса (регистрация, создание записи).
- 200: успешная операция с телом ответа (чтение, обновление, логин, refresh, смена статуса с возвратом сущности).
- 204: успешная операция без тела (обновление/удаление/смена статуса без тела).
- 202: операция принята и будет выполнена асинхронно (очереди, модерация отложенно).
*/
export enum StatusCode {
  successFind = 200,
  successCreate = 201,
  successUpdate = 200,
  successDelete = 204,
  successLogout = 204,
  successGet = 200,
  successAuth = 200,
  successToModerate = 200,
  successModerate = 200,
  Unauthorized = 401,
  InternalServerError = 500,
  BadRequest = 400,
  NotFound = 404,
}
/*export enum InterconnestionsReverseTypes { // временно не нужен
  Generalizes = 3,
  IsProblemSolution = 5
}*/


