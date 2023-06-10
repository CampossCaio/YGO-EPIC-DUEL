import useGame from "../../hooks/useGame";
import { SIDE } from "../../interfaces/enum";
import { Card } from "../Card";
import styles from "./styles.module.scss";

export type HandProps = {
  onClickCard: (card: any) => void;
  handleSelectCard: (card: any) => void;
  side: "MINE" | "OPPONENT";
};

export const Hand = ({ side, onClickCard, handleSelectCard }: HandProps) => {
  const { playerHand, opponentHand } = useGame();

  return (
    <div className={`${styles.hand} ${side === "OPPONENT" && styles.opponent}`}>
      {side === SIDE.MINE
        ? playerHand.map((card) => (
            <Card
              className={styles.card}
              card={card}
              handleSelectCard={handleSelectCard}
              onClick={onClickCard}
              key={card.id}
              side={side}
            />
          ))
        : opponentHand.map((card) => (
            <div
              key={card.id}
              style={{
                background: `center / cover url("images/cards/card_face_down.jpeg")`,
                height: 100,
                width: 70,
                border: "1px solid var(--colors-grey-100)",
              }}
            />
          ))}
    </div>
  );
};
