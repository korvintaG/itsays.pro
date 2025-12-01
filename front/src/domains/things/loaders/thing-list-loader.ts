
import store from "../../../app/store/store";
import { fetchThings } from "../store/thing-list-slice";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function thingsLoad({ request }: LoaderFunctionArgs) {
  console.log('[thingsLoad] Loader called', {
    url: request.url,
    method: request.method,
    signalAborted: request.signal?.aborted,
    hasSignal: !!request.signal
  });

  // Проверяем, не был ли запрос отменен
  if (request.signal?.aborted) {
    console.log('[thingsLoad] Request already aborted, returning null');
    return null;
  }

  console.log('[thingsLoad] Starting fetchThings dispatch');
  const result = await store.dispatch(fetchThings());
  console.log('[thingsLoad] fetchThings completed', {
    fulfilled: fetchThings.fulfilled.match(result),
    signalAborted: request.signal?.aborted
  });
  
  // Проверяем снова после выполнения запроса
  if (request.signal?.aborted) {
    console.log('[thingsLoad] Request aborted after dispatch, returning null');
    return null;
  }

  const state = store.getState();

  if (fetchThings.fulfilled.match(result)) {
    console.log('[thingsLoad] Request fulfilled, returning null');
    return null;
  }
  
  console.log('[thingsLoad] Request failed, throwing error:', state.thingList.error);
  throw new Error(state.thingList.error); 
}