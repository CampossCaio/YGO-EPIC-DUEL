import { Card } from "../Card";
import styles from "./styles.module.scss";

export type HandProps = {
  cards: Array<any>;
  onClickCard: (card: any) => void;
  handleSelectCard: (card: any) => void;
  side: "MINE" | "OPPONENT";
};

export const Hand = ({
  side,
  cards,
  onClickCard,
  handleSelectCard,
}: HandProps) => {
  return (
    <div className={`${styles.hand} ${side === "OPPONENT" && styles.opponent}`}>
      {cards.map((card) =>
        side === "OPPONENT" ? (
          <div
            key={card.id}
            style={{
              background: `center / cover url("images/cards/card_face_down.jpeg")`,
              height: 100,
              width: 70,
            }}
          />
        ) : (
          <Card
            card={card}
            handleSelectCard={handleSelectCard}
            onClick={onClickCard}
            key={card.id}
            side={side}
          />
        )
      )}
    </div>
  );
};
