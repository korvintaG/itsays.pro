import { generatePath} from "react-router-dom"
import { appRoutesURL } from "./app-routes-URL"

export const genThingURL=(id:number)=>generatePath (appRoutesURL.thing,{id})
export const genThingAddURL = appRoutesURL.thingAdd;
