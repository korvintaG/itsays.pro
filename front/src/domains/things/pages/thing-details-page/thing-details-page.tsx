import { type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "../../../../app/store/store";
import { selectCurrentUser } from "../../../../features/auth/store/auth-slice";
import { appRoutesURL } from "../../../../app/router/app-routes-URL";
import { genThingURL } from "../../../../app/router/navigation";
import { useThingDetails } from "../../hooks/use-thing-details";
import { ThingDetails } from "../../components/thing-details/thing-details";

export const ThingDetailsPage: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
  
    const gotoThingList = () => {
      console.log('[ThingDetailsPage] gotoThingList called, navigating to:', appRoutesURL.things);
      navigate(appRoutesURL.things);
      console.log('[ThingDetailsPage] navigate() called');
    }
   
    const gotoThing = (id: number) => {
      navigate(genThingURL(id));
    }
  
    const thingDetailsHookRes = useThingDetails({
      id,
      currentUser,
    });
  
  
    return <ThingDetails
        thingDetailsHookRes={thingDetailsHookRes}
        gotoThingList={gotoThingList}
        gotoThing={gotoThing}
      />
   
};
      

