export const telegramBotURL="https://t.me/itsays_pro_bot";

const routeAdd="/new"; // добавление новой записи
const routeEdit="/:id"; // редактирование записи
const routeThing="/things"; // маршрут вещей
const routeMessage="/messages"; // маршрут сообщений
const routeUser="/users"; // маршрут профиля пользователя
const routeTest="/tests"; // демо


export const appRoutesURL = {
  home: "/",
  auth: "/auth",
  things: routeThing,
  thing: routeThing+routeEdit,
  thingAdd: routeThing+routeAdd,
  messages: routeMessage+routeEdit,
  user: routeUser+routeEdit,
  tests: routeTest
};


/**
 * Возвращает маршрут с означенным параметром
 * @param route - маршрут
 * @param param - параметр
 * @returns маршрут с означенным параметром
 */
export function getRouteParam(route: string, param: number): string {
  return getRouteWParam(route) + param;
}

/**
 * Взять маршрут без подстроки параметра (с ":")
 * @param route  - маршрут
 * @returns строка маршрута без параметра
 */
export function getRouteWParam(route: string): string {
  const pos = route.indexOf(":");
  if (pos === -1) return route;
  else return route.substring(0, pos);
}

export function genPath(path:string):string{
  return `/${path}`
}