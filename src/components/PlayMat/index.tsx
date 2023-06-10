import styles from "./styles.module.scss";
import useGame from "../../hooks/useGame";
import { CARD_POS, SIDE } from "../../interfaces/enum";

import classNames from "classnames";

export type PlayMatProps = {
  fieldCards: Array<any>;
  deckCards: Array<any>;
  graveyardCards: Array<any>;
  side?: "MINE" | "OPPONENT";
  battle?: (args: any) => void;
};

export const PlayMat = ({
  fieldCards,
  deckCards,
  graveyardCards,
  side = "MINE",
}: PlayMatProps) => {
  const {
    setIsMonsterActionsModalOpen,
    setSelectedCard,
    playerId,
    duelistTurn,
    firstTurn,
  } = useGame();

  const isMyTurn = playerId === duelistTurn;

  function buildCardsBoxFrom(
    fieldCards: Array<any>,
    deckCards: Array<any>,
    graveyardCards: Array<any>
  ) {
    const cardsBox = [
      { type: "ESPECIAL", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "GRAVEYARD", card: null },
      { type: "ESPECIAL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "DECK", card: null },
    ];

    fieldCards?.map((card) => {
      const index = cardsBox.findIndex(
        (box) => box.type === "MONSTER" && box.card === null
      );
      cardsBox[index].card = card;
    });

    const deckBoxIndex = cardsBox.findIndex((box) => box.type === "DECK");

    cardsBox[deckBoxIndex].card = {
      image: "images/cards/card_face_down.jpeg",
    } as any;

    const graveyardBoxIndex = cardsBox.findIndex(
      (box) => box.type === "GRAVEYARD"
    );

    cardsBox[graveyardBoxIndex].card =
      graveyardCards[graveyardCards.length - 1];

    return cardsBox;
  }

  function specialBox(box: any) {
    return box.type !== "TRAP/ESPELL" && box.type !== "MONSTER";
  }

  function handleClick(box, side) {
    if (side === "MINE" && !specialBox(box) && isMyTurn && !firstTurn) {
      setIsMonsterActionsModalOpen(true);
      setSelectedCard(box.card);
    }
  }

  function handleMouseEnter(box, side) {
    if (box.card) {
      if (side === SIDE.OPPONENT && box.card.pos === CARD_POS.SET) return;

      setSelectedCard(box.card);
    }
  }

  function handleMouseLeave(box, side) {
    setSelectedCard(null);
  }

  return (
    <div
      className={`${styles.playMat} ${side === "OPPONENT" && styles.opponent}`}
    >
      {buildCardsBoxFrom(fieldCards, deckCards, graveyardCards).map(
        (box, index) => (
          <div
            key={index}
            className={classNames(styles.cardsBox, {
              [styles.especialBox]: specialBox(box),
            })}
          >
            {box.card && (
              <div
                className={styles.card}
                onClick={() => handleClick(box, side)}
                onMouseEnter={() => handleMouseEnter(box, side)}
                // onMouseLeave={() => handleMouseLeave(box, side)}
                style={{
                  background: `center / cover url(${
                    box.card.pos === "SET"
                      ? "images/cards/card_face_down.jpeg"
                      : box.card.image
                  })`,
                  transform: `${
                    box.card.pos === "DEFENSE" || box.card.pos === "SET"
                      ? "rotate(-90deg)"
                      : "rotate(0)"
                  }`,
                }}
              >
                {specialBox(box) && (
                  <span
                    style={{
                      transform: `${
                        side === "OPPONENT" ? "rotate(-180deg)" : "rotate(0)"
                      }`,
                    }}
                  >
                    {box.type === "DECK"
                      ? deckCards.length
                      : graveyardCards.length}
                  </span>
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
