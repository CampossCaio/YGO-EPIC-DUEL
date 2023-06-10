import classNames from "classnames";
import { Modal } from "..";
import styles from "./styles.module.scss";

export type NotifyModalProps = {
  text: string;
  opened: boolean;
  animation?: "scale" | "slide";
};

export const NotifyModal = ({
  text,
  opened,
  animation = "scale",
}: NotifyModalProps) => {
  return (
    <Modal isOpen={opened}>
      <div className={classNames(styles.container, styles[animation])}>
        <span>{text}</span>
      </div>
    </Modal>
  );
};
