import { type FC, type SyntheticEvent } from "react";
import styles from "./record-edit-form.module.css";
import { RequestStatus } from "../../types/types-for-hooks";
import { Preloader } from "../../ui/preloader"; 
import { ErrorMessageUI } from "../../ui/error-message/error-message";
import { Breadcrumbs} from "../bread-crumbs/bread-crumbs";

export type RecordEditFormProps = {
  children: React.ReactNode;
  onSubmit: (e: SyntheticEvent) => void;
  sliceState:RequestStatus[];
  error:string;
  fetchRecord: ()=>void;
  header: string;
  backLink: string;
};

export const RecordEditForm: FC<RecordEditFormProps> = (
  props: RecordEditFormProps,
) => {
  if (props.sliceState && props.sliceState.find(el=>el=== RequestStatus.Loading))
    return <Preloader/>

  if (props.sliceState && props.sliceState.find(el=>el===RequestStatus.Failed))
    return <ErrorMessageUI
      error={props.error?props.error:null}
      okAction={props.fetchRecord}
      errorTitle="Ошибка"
      okCaption="Повторить запрос"
    />
//{props.header && <h1 className={styles["record-header"]}>{props.header}</h1>}
  return (
    <div className={styles.form_container}>
        <Breadcrumbs 
          backLink={props.backLink} 
          header={props.header}
        />
      <form
        onSubmit={props.onSubmit}
        className={styles.form}
      >
        {props.children}
      </form>
    </div>
  );
};
