import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSliceReducer from "../../features/auth/store/auth-slice";
import thingListSliceReducer from "../../domains/things/store/thing-list-slice";
import thingDetailsSliceReducer from "../../domains/things/store/thins-details-slice";
import filesReducer from "../../features/files/store/files-slice";

import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";

export const rootReducer = combineReducers({
  auth: authSliceReducer,
  thingList: thingListSliceReducer,
  thingDetails: thingDetailsSliceReducer,
  files: filesReducer
});

export const store = configureStore({
  reducer: rootReducer,
  //devTools: process.env.NODE_ENV !== "production",
});

export const logger = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.info("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();

export default store;
