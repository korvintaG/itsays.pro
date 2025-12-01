import { useSelector, useDispatch } from "../../../app/store/store";
import {
    selectThings,
    fetchThings,
    selectSliceState,
    selectError,
  } from "../store/thing-list-slice";


export const useThingList =(gotoThingAdd:()=>void)=>{
    const things = useSelector(selectThings);
    const sliceState = useSelector(selectSliceState)
    const error= useSelector(selectError)
    const dispatch = useDispatch();

    const fetchRecords = ()=>{
      dispatch(fetchThings());
    }

    const addNewThing = () => {
        gotoThingAdd();
      };

    return {things, sliceState, addNewThing, fetchRecords, error}
}