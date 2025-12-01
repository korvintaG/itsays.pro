import { type Params, type LoaderFunctionArgs } from "react-router-dom";
import { clearCurrentThing, getThing } from "../store/thins-details-slice";
import store from "../../../app/store/store";
import { setSliceStatus } from "../store/thins-details-slice";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { resetState } from "../../../features/files/store/files-slice";
//import { resetState } from "../../../features/files/store/filesSlice";



export async function thingLoad({ params, request }: LoaderFunctionArgs) {
  console.log('[thingLoad] Loader called', {
    id: params.id,
    url: request.url,
    method: request.method,
    signalAborted: request.signal?.aborted,
    hasSignal: !!request.signal
  });

  // Проверяем, не был ли запрос отменен
  if (request.signal?.aborted) {
    console.log('[thingLoad] Request already aborted, returning null');
    return null;
  }

  let errorText = '';
  const { id } = params;
  console.log('[thingLoad] Dispatching clearCurrentThing, resetState, setSliceStatus');
  store.dispatch(clearCurrentThing());
  store.dispatch(resetState());
  store.dispatch(setSliceStatus(RequestStatus.Idle))
  
  if (id) {
    // Проверяем снова перед выполнением запроса
    if (request.signal?.aborted) {
      console.log('[thingLoad] Request aborted before getThing, returning null');
      return null;
    }

    console.log('[thingLoad] Starting getThing dispatch for id:', id);
    //store.dispatch(resetState());
    const result = await store.dispatch(getThing(Number(id)));
    console.log('[thingLoad] getThing completed', {
      fulfilled: getThing.fulfilled.match(result),
      signalAborted: request.signal?.aborted
    });
    
    // Проверяем снова после выполнения запроса
    if (request.signal?.aborted) {
      console.log('[thingLoad] Request aborted after getThing, returning null');
      return null;
    }

    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (getThing.fulfilled.match(result)) {
      console.log('[thingLoad] Request fulfilled, returning null');
      return null;
    }
    errorText = state.thingDetails.error;
    console.log('[thingLoad] Request failed, throwing error:', errorText);

    throw new Error(errorText);
  }
  //else
  //  throw new Error('Нет параметра ID запроса');
}