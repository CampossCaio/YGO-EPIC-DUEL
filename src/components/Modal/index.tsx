import { ReactElement } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

export type ModalProps = {
  isOpen: boolean;
  children: ReactElement;
};

export const Modal = ({ isOpen, children }: ModalProps) => {
  return (
    <div className={classNames(styles.modal, { [styles.open]: isOpen })}>
      {children}
    </div>
  );
};
