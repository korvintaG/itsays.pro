import Modal from "react-modal";
import { type FC, type SyntheticEvent } from "react";
import CloseIcon from "../../../../assets/images/close-icon.svg?react";
import styles from "./msg-error-modal.module.css";
import { Button } from "../../button";

export type MsgErrorModalUIProps = {
  message: string;
  closeAction: () => void;
};

export const MsgErrorModalUI: FC<MsgErrorModalUIProps> = (props) => {
  const yesAction = (e: SyntheticEvent) => {
    props.closeAction();
  };


  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      preventScroll={false}
      style={{
        overlay: {zIndex: 999},
        content: {
          maxWidth: 500,
          whiteSpace: 'pre-line',
          height: "min-content",
          margin: "auto",
        },
      }}
      onRequestClose={props.closeAction}
    >
      <button className={styles["close-button"]} onClick={props.closeAction}>
        <CloseIcon />
      </button>
      <p className={styles.error} data-cy="error-message">{props.message}</p>
      <div className={styles.buttons}>
        <Button 
          onClick={yesAction} 
          disabled={false}
          data-cy="ok-button"
        >
          "OK" 
        </Button>
      </div>
    </Modal>
  );
};
