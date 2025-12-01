import { 
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import ThingAPI from "../api/thing-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { type ThingDetail } from "../types/thing-types";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { type SliceDetail } from "../../../shared/types/types-for-slice";

export const initialState: SliceDetail<ThingDetail> = {
  current: null,
  status: RequestStatus.Idle,
  error: "",
  newID: undefined,
};

export const setThing = createAsyncThunk("setThing", ThingAPI.setEntity);

export const getThing = createAsyncThunk("getThing", ThingAPI.getEntity);
export const addThing = createAsyncThunk("addThing", ThingAPI.addEntity);
export const delThing = createAsyncThunk("delThing", ThingAPI.delEntity);

const thingDetailsSlice = createSlice({
  name: "thingDetails",
  initialState,
  reducers: {
    clearCurrentThing: (state) => {
      state.current = null;
    }, 
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
    /*setNewImageName: (state, action) => {
      if (state.current)
        state.current.new_image_URL = action.payload; //RequestStatus.Success;
    },*/
  },
  selectors: {
    selectNewID: (sliceState) => sliceState.newID,
    selectCurrentThing: (sliceState) => sliceState.current,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getThing.pending, (state) => {
        state.current = null;
      })
      .addCase(getThing.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addThing.fulfilled, (state, action) => {
        console.log('[thingDetailsSlice] addThing.fulfilled - setting status to Added, newID:', action.payload.id);
        state.status = RequestStatus.Added;
        state.newID = action.payload.id;
      })
      .addCase(delThing.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addThing.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(getThing.rejected, (state, _) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(delThing.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addMatcher(
        isAnyOf(
          setThing.rejected,
        ),
        (state, _) => {
          state.status = RequestStatus.FailedUpdate;
        },
      )
      .addMatcher(
        isAnyOf(
          setThing.fulfilled,
        ),
        (state, _) => {
          console.log('[thingDetailsSlice] setThing.fulfilled - setting status to Updated');
          state.status = RequestStatus.Updated;
        },
      )
      .addMatcher(
        isAnyOf(getThing.fulfilled),
        (state, _) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(
          setThing.pending,
          getThing.pending,
          addThing.pending,
          delThing.pending,
        ), (state, action) => {
        console.log('[thingDetailsSlice] Action pending:', action.type, '- setting status to Loading');
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          setThing.rejected,
          getThing.rejected,
          addThing.rejected,
          delThing.rejected,
      ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectCurrentThing,
  selectSliceState,
  selectNewID,
} = thingDetailsSlice.selectors;
export const { clearCurrentThing, setSliceStatus/*, setNewImageName*/ } = thingDetailsSlice.actions; 
export default thingDetailsSlice.reducer;
