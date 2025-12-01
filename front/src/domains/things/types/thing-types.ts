import type { IDObject, NameObject } from "../../../shared/types/entity-types";

export type ThingAdd = NameObject & {
    description?: string;
    UIN?: string;
    image_URL: string | null ;
    image_URL_brief?: string | null | undefined;
    new_image_URL?: string | null | undefined;
  }

export type ThingDetail = ThingAdd & IDObject & {
    created_at: Date; 
    updated_at: Date;
    user_id: number;
}

export type ThingDetailPartial = Partial<ThingDetail> & IDObject;

export type ThingListData = ThingDetail[];