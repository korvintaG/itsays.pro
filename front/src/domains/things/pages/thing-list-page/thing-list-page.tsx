import { type FC } from "react";
import { useSelector } from "../../../../app/store/store";
import { selectCurrentUser } from "../../../../features/auth/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { genThingAddURL } from "../../../../app/router/navigation";
import { ThingList } from "../../components/thing-list/thing-list";

export const ThingListPage: FC = () => {
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
  
    const gotoThingAdd = () => {
      navigate(genThingAddURL);
    };
  
    //const thingList=
    return <ThingList gotoThingAdd={gotoThingAdd} />
}
