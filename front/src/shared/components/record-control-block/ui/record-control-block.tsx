import { useEffect, type ReactElement, useRef } from "react";
import styles from "../styles/record-control-block.module.css";
import { Button } from "../../../ui/button";
import {
  EditAccessStatus,
  getErrorTypeBySlice,
  isDMLRequestFailed,
} from "../../../utils/utils";
import { useMsgModal } from "../../../hooks/useMsgModal";
import { type RecordControlBlockProps } from "../types/types";
import { RequestStatus } from "../../../types/types-for-hooks";
import { MsgQuestionUI } from "../../../ui/modal/msg-question";
import { MsgErrorModalUI } from "../../../ui/modal/msg-error-modal/msg-error-modal";

export function RecordControlBlock<T>(
  props: RecordControlBlockProps<T>
): ReactElement {
  const msgDeleteHook = useMsgModal();
  const msgErrorHook = useMsgModal();
  const { form, status, record } = props.entityDetailsHook;
  const navigationScheduledRef = useRef(false);

  const saveCaption = props.entityDetailsHook.record.id
    ? "Сохранить данные"
    : "Добавить данные";

  useEffect(() => {
    const currentStatus = status.sliceStates[0];
    const shouldNavigate = 
      currentStatus === RequestStatus.Added ||
      currentStatus === RequestStatus.Updated ||
      currentStatus === RequestStatus.Deleted;

    if (shouldNavigate && !navigationScheduledRef.current) {
      navigationScheduledRef.current = true;
      
      if (currentStatus === RequestStatus.Deleted) {
        status.resetSlicesStatus();
      }
      
      const navigate = () => {
        navigationScheduledRef.current = false;
        props.gotoEntityList();
      };

      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(navigate);
      } else {
        Promise.resolve().then(navigate);
      }
    } else if (!shouldNavigate) {
      navigationScheduledRef.current = false;
    }
  }, [status.sliceStates[0]]);

  useEffect(() => {
    if (
      isDMLRequestFailed(status.sliceStates[0]) ||
      (status.sliceStates[1] && isDMLRequestFailed(status.sliceStates[1]))
    ) {
      msgErrorHook.openDialogDirectly();
    }
  }, [status.sliceStates[0], status.sliceStates[1]]);

  const errorCloseAction = () => {
    if (status.resetSlicesStatus) status.resetSlicesStatus();
    msgErrorHook.closeDialog();
  };

  return <div className={styles.container}>
    {msgDeleteHook.dialogWasOpened && (
      <MsgQuestionUI
        yesIsAlert
        question="Удалить запись?"
        closeAction={msgDeleteHook.closeDialog}
        action={record.deleteRecordAction}
      />
    )}
    {msgErrorHook.dialogWasOpened && (
      <MsgErrorModalUI
        message={`${getErrorTypeBySlice(status.sliceStates[0])} ${status.errorText}`}
        closeAction={errorCloseAction}
      />
    )}

    <div
      className={styles["button-block"]}
    >
      {status.editAccessStatus &&
        [EditAccessStatus.Editable,
        EditAccessStatus.EditableAndModeratable,
        EditAccessStatus.EditableAndPublishable].includes(status.editAccessStatus) && (
          <>
            <Button
              disabled={!form?.editStarted}
              data-cy="save-record-button"
            >
              {saveCaption}
            </Button>

            {props.entityDetailsHook.record && props.entityDetailsHook.record.id && (
              <Button
                data-cy="delete-record-button"
                onClick={msgDeleteHook.openDialog}
              >
                Удалить запись
              </Button>
            )}
          </>
        )}

    </div>


  </div>
}