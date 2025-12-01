import Modal from "react-modal";
import { type FC, type SyntheticEvent } from "react";
import CloseIcon from "../../../../assets/images/close-icon.svg?react";
import styles from "./msg-question.module.css";
import { Button } from "../../button";

export type MsgQuestionUIProps = {
  question: string;
  action: (e: SyntheticEvent) => void;
  closeAction: () => void;
  yesIsAlert?: boolean;
};

export const MsgQuestionUI: FC<MsgQuestionUIProps> = (props) => {

  const yesAction = (e: SyntheticEvent) => {
    props.action(e);
    props.closeAction();
  };

  const noAction = (e: SyntheticEvent) => {
    props.closeAction();
  };

  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      preventScroll={false}
      style={{
        overlay: {zIndex: 222},
        content: {
          maxWidth: 500,
          height: "min-content",
          margin: "auto",
        },
      }}
      onRequestClose={props.closeAction}
    >
      <button className={styles["close-button"]} onClick={noAction}>
        <CloseIcon />
      </button>
      <p className={styles.question}>{props.question}</p>
      <div className={styles.buttons}>
        <Button
          data-cy="yes-button" 
          onClick={yesAction} 
        >
          "Да" 
          </Button>
        <Button 
          data-cy="no-button" 
          onClick={noAction} 
        >
          "Нет" 
        </Button>
      </div>
    </Modal>
  );
};
