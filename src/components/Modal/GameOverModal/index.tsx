import classNames from "classnames";
import { Modal } from "..";
import styles from "./styles.module.scss";

export type NotifyModalProps = {
  status: "winner" | "loser";
  opened: boolean;
};

export const GameOverModal = ({ status, opened }: NotifyModalProps) => {
  const winner = status === "winner";
  return (
    <Modal isOpen={opened}>
      <div className={classNames(styles.container)}>
        {winner ? (
          <>
            <h1>YOU WIN</h1>
            <span>{"Your opponent's Life Points have been reduced to 0"}</span>
          </>
        ) : (
          <>
            <h1>YOU LOST</h1>
            <span>{"Your Life Points have been reduced to 0"}</span>
          </>
        )}
      </div>
    </Modal>
  );
};
