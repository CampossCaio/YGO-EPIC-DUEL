import { Modal } from "..";
import useGame from "../../../hooks/useGame";
import { CARD_POS } from "../../../interfaces/enum";
import styles from "./styles.module.scss";

export const MonsterActionsModal = () => {
  const {
    isMonsterActionsModalOpen,
    setIsMonsterActionsModalOpen,
    setStartedAnattack,
    setSelectedCard,
    selectedCard,
    changeCardPosition,
    setCardStriker,
    directAttack,
    opponentField,
  } = useGame();

  const isDirectAttack = opponentField.length === 0;

  function handleAttack() {
    setCardStriker(selectedCard);
    setStartedAnattack(true);
    setIsMonsterActionsModalOpen(false);
  }

  function handleCancel() {
    setIsMonsterActionsModalOpen(false);
    setSelectedCard(null);
  }

  function closeMonsterActionsModalAndClearSelectedCard() {
    setIsMonsterActionsModalOpen(false);
    setSelectedCard(null);
  }

  function handleChangeCardPosition() {
    const newPosition =
      selectedCard?.pos === CARD_POS.FACE ? CARD_POS.DEFENSE : CARD_POS.FACE;
    changeCardPosition(selectedCard, newPosition);
    closeMonsterActionsModalAndClearSelectedCard();
  }

  function handleDirectAttack() {
    directAttack(selectedCard);
    closeMonsterActionsModalAndClearSelectedCard();
  }

  return (
    <Modal isOpen={isMonsterActionsModalOpen}>
      <div className={styles.content}>
        {!selectedCard?.hasAttacked && selectedCard?.pos === CARD_POS.FACE && (
          <button onClick={isDirectAttack ? handleDirectAttack : handleAttack}>
            {isDirectAttack ? "Direct Attack" : "Attack"}
          </button>
        )}
        {!selectedCard?.hasChangedPosition && (
          <button onClick={handleChangeCardPosition}>
            {selectedCard?.pos === CARD_POS.FACE
              ? "Change to defense"
              : "Change to attack"}
          </button>
        )}

        <button onClick={handleCancel}>Cancel</button>
      </div>
    </Modal>
  );
};
