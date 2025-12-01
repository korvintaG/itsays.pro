import { 
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import type { ThingListData } from "../types/thing-types";
import type { SliceList } from "../../../shared/types/types-for-slice";
import thingAPI from "../api/thing-api";

export const initialState: SliceList<ThingListData> = {
  list: [],
  status: RequestStatus.Idle,
  error: ""
};

export const fetchThings = createAsyncThunk(
  "fetchThings",
  thingAPI.getEntities,
);

const thingListSlice = createSlice({
  name: "thingList",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; 
    },
  },
  selectors: {
    selectThings: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThings.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.list = [];
        state.error = "";
      })
      .addCase(fetchThings.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(fetchThings.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      })
  },
});

export const {
  selectError,
  selectThings,
  selectSliceState,
} = thingListSlice.selectors;
export const { setSliceStatus } = thingListSlice.actions; 
export default thingListSlice.reducer;
