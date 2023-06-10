import { useState } from "react";
import { Modal } from "..";
import useGame from "../../../hooks/useGame";
import { Card } from "../../Card";

import styles from "./styles.module.scss";
import classNames from "classnames";

export const OpponentFieldModal = () => {
  const {
    setStartedAnattack,
    startedAnattack,
    setCardTarget,
    opponentField,
    battle,
  } = useGame();
  const [selected, setSelected] = useState(null);

  function handleClick(card: any) {
    setSelected(card);
    setCardTarget(card);
  }

  function handleConfirm() {
    setStartedAnattack(false);
    battle();
    setSelected(null);
  }

  return (
    <Modal isOpen={startedAnattack}>
      <div className={styles.container}>
        <section className={styles.header}>
          <span>Please selct 1 monster from the folowing</span>
        </section>
        <section className={styles.content}>
          {opponentField.map((card) => (
            <Card
              className={classNames(styles.card, {
                [styles.selected]: selected?.id === card.id,
              })}
              card={card}
              handleSelectCard={() => {}}
              onClick={handleClick}
              key={card.id}
              side="MINE"
            />
          ))}
        </section>
        <section className={styles.footer}>
          <button onClick={() => setStartedAnattack(false)}>Cancel</button>
          <button disabled={!selected} onClick={handleConfirm}>
            Confirm
          </button>
        </section>
      </div>
    </Modal>
  );
};
