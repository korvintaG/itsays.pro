import { Link } from "react-router-dom"
import { type ThingDetail, type ThingListData } from "../../../types/thing-types"
import { genThingURL } from "../../../../../app/router/navigation"
import { STORE_FILE_PATH } from "../../../../../shared/components/record-image/record-image"
import styles from "./thing-list-el.module.scss"

export type ThingListElProps= {
    thing: ThingDetail,
    cnt: number,
}

export const ThingListEl: React.FC<ThingListElProps> = ({thing, cnt}) => {
    return (
                <li 
                  className={styles.thing} 
                  key={`thing_list_${thing.id}`} 
                  data-cy={`thing_list_${cnt}`}
                >
                    <Link
                    key={`thing_link_${thing.id}`}
                    to={genThingURL(thing.id)}
                    data-cy={`thing_link_${cnt}`}
                    className={styles.link}
                    >
                    {thing.image_URL_brief && 
                      <div className={styles.avatar}>
                        <img 
                          className={styles.image}
                          src={`${STORE_FILE_PATH}/${thing.image_URL_brief}`} 
                          alt={thing.name} 
                        />
                      </div>
                    }
                    <div className={styles.info}>
                      <p className={styles.name}>{thing.name}</p>
                      <p className={styles.UIN}>{thing.UIN}</p>
                    </div>
                    </Link>
                </li>
    )
}