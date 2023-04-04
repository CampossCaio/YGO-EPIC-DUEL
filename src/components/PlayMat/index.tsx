import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export type PlayMatProps = {
  cards: Array<any>;
  confirmSummon: (index: number) => void;
  side?: "MINE" | "OPPONENT";
};

const especialBoxIndexs = [0, 6, 7, 13];
const trapAndSpellIndexs = [8, 9, 10, 11, 12];
const monsterIndexs = [1, 2, 3, 4, 5];

const cardsBox = new Array(14).fill(null);

export const PlayMat = ({
  cards,
  confirmSummon,
  side = "MINE",
}: PlayMatProps) => {
  const [att, setAtt] = useState(null);
  const [target, setTarget] = useState(null);

  function buildCardsBoxFrom(cards: Array<any>) {
    const cardsBox = [
      { type: "ESPECIAL", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "MONSTER", card: null },
      { type: "ESPECIAL", card: null },
      { type: "ESPECIAL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "TRAP/ESPELL", card: null },
      { type: "ESPECIAL", card: null },
    ];

    cards?.map((card) => {
      const index = cardsBox.findIndex(
        (box) => box.type === "MONSTER" && box.card === null
      );
      cardsBox[index].card = card;
    });

    return cardsBox;
  }

  function test() {
    alert(att);
  }

  function handleClick(card, side) {
    if (side === "MINE") {
      const accepted = confirm("Deseja realizar um ataque?");
      if (accepted) {
        setAtt(card);
        alert(card.name);
      }
      return;
    }

    const accepted = confirm(`Deseja atacar ${card.name}?`);
    if (accepted) {
      setTarget(card);

      test();
    }
  }

  return (
    <div
      className={`${styles.playMat} ${side === "OPPONENT" && styles.opponent}`}
    >
      {buildCardsBoxFrom(cards).map((box, index) => (
        <div
          key={index}
          className={`${styles.cardsBox} ${
            box.type === "ESPECIAL" && styles.especialBox
          }`}
          onClick={() => confirmSummon(index)}
        >
          {box.card && (
            <div
              className={styles.card}
              onClick={() => handleClick(box.card, side)}
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
            />
          )}
        </div>
      ))}
    </div>
  );
};
