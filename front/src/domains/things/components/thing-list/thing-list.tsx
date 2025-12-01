import { type FC } from "react";
import { Link } from "react-router-dom";
import { RecordsList } from "../../../../shared/components/records-list";
import { genThingURL } from "../../../../app/router/navigation";
import { useThingList } from "../../hooks/use-thing-list";
import { appRoutesURL } from "../../../../app/router/app-routes-URL";
import { ThingListEl } from "./thing-list-el/thing-list-el";

type ThingsListProps = {
    gotoThingAdd: ()=>void;
}

export const ThingList: FC<ThingsListProps> = ({gotoThingAdd}) => {
    const {things, sliceState, addNewThing, fetchRecords, error } = useThingList(gotoThingAdd);
  
    return <RecordsList
              header="Мои вещи"
              backLink={appRoutesURL.home}
              sliceState={sliceState}
              error={error}
              fetchRecords={fetchRecords}
              captionAddButton="Добавить вещь"
              addRecord={addNewThing}
            >
              
              {things.map((thing, cnt) => 
                <ThingListEl thing={thing} cnt={cnt}/>
              )}
    </RecordsList>
}
  