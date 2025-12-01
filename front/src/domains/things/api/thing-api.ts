import { EntityAPI, type IEntityAPI } from '../../../shared/api/entity-api';
import type { ThingAdd, ThingDetail, ThingDetailPartial, ThingListData } from '../types/thing-types';

export interface IThingAPI extends IEntityAPI<ThingAdd, 
  ThingDetailPartial, ThingDetail,
  undefined, ThingListData> {
}

export class ThingAPI extends EntityAPI<
  ThingAdd, 
  ThingDetailPartial, ThingDetail,
  undefined, ThingListData>
implements IThingAPI {
  constructor() {
    super("things");
  }
}

const thingAPI=new ThingAPI();
export default thingAPI;
