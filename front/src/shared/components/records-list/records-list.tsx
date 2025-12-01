import { type FC, type SyntheticEvent } from "react";
import clsx from "clsx";
import styles from "./records-list.module.css";
import { RequestStatus } from "../../types/types-for-hooks";
import { ErrorMessageUI } from "../../ui/error-message/error-message";
import { Breadcrumbs } from "../../components/bread-crumbs/bread-crumbs";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Preloader } from "../../ui/preloader";

export type RecordListProps = {
  children: React.ReactNode;
  sliceState: RequestStatus;
  error:string;
  fetchRecords: ()=>void;
  captionAddButton?: string;
  header: string;
  addRecord?: () => void;
  skipUl?: boolean; // не писать UL в начале списка
  liMobileAlteration?: boolean; // чередование полос списка в мобильном варианте
  readOnly?: boolean;
  backLink: string;
  showBackButton?:boolean;
};

export const RecordsList: FC<RecordListProps> = (
  props: RecordListProps,
) => {
  
  const navigate = useNavigate();
  if (props.sliceState === RequestStatus.Loading)
    return <Preloader />;

  if (props.sliceState===RequestStatus.Failed)
    return <ErrorMessageUI
      error={props.error?props.error:null}
      okAction={props.fetchRecords}
      errorTitle="Ошибка" 
      okCaption="Повторить запрос"
    />

  const back = (e: SyntheticEvent<Element, Event>) => {
    //e.preventDefault();
    navigate(-1);
  };


  return (
    <div 
      className={clsx(styles.main, "main", {[styles["main-shrink"]]: props.liMobileAlteration})}
      data-cy="records-list"
    >
        <Breadcrumbs 
          backLink={props.backLink} 
          header={props.header}
        />
      {props.skipUl ? (
        props.children
      ) : (
        <ul
          className={clsx(styles.list, {
            [styles["list-mobile-alterarion"]]: props.liMobileAlteration,
          })}
        >
          {props.children}
        </ul>
      )}
      {props.addRecord && !props.readOnly && <div className={styles.addRecord}>
          <Button
             onClick={props.addRecord}
             disabled={props.readOnly}
             data-cy="add-record-button"
          >
            {props.captionAddButton}
          </Button>
        </div>}
      </div>
  );
};
