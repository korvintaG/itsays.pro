import { type SyntheticEvent } from "react";
import {
    EditAccessStatus,
  } from "../../../utils/utils";
import { type IDetailsEditHookRes } from "../../../types/types-for-hooks";

export type RecordControlBlockProps<T> = {
    gotoEntityList: () => void;
    gotoEntityEdit: (id: number) => void;
    entityDetailsHook: T extends IDetailsEditHookRes<any, any> ? T : never; 
  };
  
  