import { useEffect, type SyntheticEvent } from "react";
import { pick } from "lodash";
import { useForm } from "../../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../../app/store/store";
import { type ThingAdd, type ThingDetail } from "../types/thing-types";
import {
  setThing,
  selectCurrentThing,
  delThing,
  selectError,
  getThing,
  addThing,
  selectSliceState,
  setSliceStatus,
  selectNewID,
} from "../store/thins-details-slice";
import { selectCurrentFile, selectSliceState as selectFileSliceState, 
  selectError as fileSelectError,
  setSliceStatus as setFileSliceStatus,
  uploadFile, 
  setCurrentFileName} from "../../../features/files/store/files-slice"; 
import {
  EditAccessStatus,
  getEditAccess,
} from "../../../shared/utils/utils";
import { type DetailsHookProps, type IDetailsWithPhotoHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { calcUpdateImage } from "../../../features/files/utils";
import { useNavigate } from "react-router-dom";


export const useThingDetails = ({ id, currentUser }: DetailsHookProps)
  : IDetailsWithPhotoHookRes<ThingAdd, ThingDetail> => {
  const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, setEditStarted } = useForm<ThingAdd>({
    name: "",
    description: "",
    image_URL: "",
    new_image_URL: undefined
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliceState = useSelector(selectSliceState);
  const fileSliceState = useSelector(selectFileSliceState);
  const currentFile = useSelector(selectCurrentFile);
  const errorText = useSelector(selectError);
  const fileErrorText=useSelector(fileSelectError);
  const currentRecord = useSelector(selectCurrentThing);
  const editAccessStatus =  EditAccessStatus.Editable //getEditAccess(id, currentUser, currentRecord)
  const newID = useSelector(selectNewID);

  function fetchRecord() {
    if (id) {
      dispatch(getThing(Number(id)))
      setEditStarted(false);
    }
  }

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord,
          ["name", "description", "UIN", "image_URL"]), // 
        new_image_URL: undefined
      });
      //setCurrentFileName(currentRecord.image_URL);
    }
  }, [currentRecord, setValues]);

  useEffect(() => {
    if (currentFile) {
      setValues({ ...values, new_image_URL: currentFile })
    }
  }, [currentFile])

  const deleteRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(delThing(Number(id)));
  };

  const uploadFileAction = (data: FormData) => {
    setEditStarted(true);
    dispatch(uploadFile(data));
  }

  const resetSlicesStatus = ()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
    dispatch(setFileSliceStatus(RequestStatus.Idle));
  }

  const handleSubmitAction = (e: SyntheticEvent) => {
    console.log('[useThingDetails] handleSubmitAction called', { id, hasValues: !!values });
    e.preventDefault();
    let newImageURL=calcUpdateImage( values.image_URL , values.new_image_URL );
    if (id) {
      const newo = { ...getFormDTO(), id: Number(id), image_URL: newImageURL };
      console.log('[useThingDetails] Dispatching setThing', newo);
      dispatch(setThing(newo));
    }
    else { 
      const newThing = { ...getFormDTOObl(), image_URL: (newImageURL? newImageURL : null) };
      console.log('[useThingDetails] Dispatching addThing', newThing);
      dispatch(addThing(newThing));
    }
  };

  useEffect(() => {
    console.log('[useThingDetails] sliceState changed:', sliceState);
    if (sliceState === RequestStatus.Updated) {
      console.log('[useThingDetails] Status is Updated');
    } else if (sliceState === RequestStatus.Added) {
      console.log('[useThingDetails] Status is Added');
    }
  }, [sliceState]);

  return {
    form: {
      values,
      handleChange,
      setValues,
      editStarted,
      setEditStarted
    },
    record: {
      id: id?Number(id): undefined,
      newID,
      fetchRecord,
      currentRecord,
      deleteRecordAction,
      handleSubmitAction,
      uploadFileAction
    },
    status: {
      sliceStates: [sliceState, fileSliceState],
      errorText: errorText + fileErrorText, 
      editAccessStatus,
      resetSlicesStatus 
    }
  }

}