import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Field } from "../components/Field";
import { Hand } from "../components/Hand";
import { SideBar } from "../components/SideBar";
import GameCore from "../@core/game";
import useGame from "../hooks/useGame";
import { Modal } from "../components/Modal";

const cards = [
  {
    id: "23995346",
    name: "Blue-Eyes Ultimate Dragon",
    att: 4500,
    def: 3800,
    pos: "SET",
    image: "/images/cards/kaiba_deck/23995346.jpg",
  },
  {
    id: "89631139",
    name: "Blue-Eyes White Dragon",
    att: 3000,
    def: 2500,
    pos: "FACE",
    image: "images/cards/kaiba_deck/89631139.jpg",
  },
  {
    id: "2111707",
    name: "XY-Dragon Cannon",
    att: 2200,
    def: 1900,
    pos: "DEFENSE",
    image: "/images/cards/kaiba_deck/2111707.jpg",
  },
  {
    id: "5053103",
    name: "Battle Ox",
    att: 1700,
    def: 1000,
    image: "/images/cards/kaiba_deck/5053103.jpg",
    pos: "FACE",
  },
  {
    id: "10000000",
    name: "Obelisk the Tormentor",
    att: 4000,
    def: 4000,
    image: "/images/cards/kaiba_deck/10000000.jpg",
    pos: "FACE",
  },
  {
    id: "14898066",
    name: "Vorse Raider",
    att: 1900,
    def: 1200,
    image: "/images/cards/kaiba_deck/14898066.jpg",
    pos: "FACE",
  },
  {
    id: "17444133",
    name: "Kaiser Sea Horse",
    att: 1700,
    def: 1650,
    image: "/images/cards/kaiba_deck/17444133.jpg",
    pos: "FACE",
  },
  {
    id: "17658803",
    name: "Luster Dragon",
    att: 2400,
    def: 1400,
    image: "/images/cards/kaiba_deck/17658803.jpg",
    pos: "FACE",
  },
  {
    id: "17985575",
    name: "Lord of D.",
    att: 1200,
    def: 1100,
    image: "/images/cards/kaiba_deck/17985575.jpg",
    pos: "FACE",
  },
  {
    id: "22804644",
    name: "Doom Virus Dragon",
    att: 1900,
    def: 1500,
    image: "/images/cards/kaiba_deck/22804644.jpg",
    pos: "FACE",
  },
];

const player = {
  deck: cards,
};

const opponent = {
  deck: cards,
};

const Game: NextPage = () => {
  const [cardsBox, setCardsBox] = useState(new Array(14).fill(null));
  const [monsterToBeSummoned, setMonsterToBeSummoned] = useState(null);
  // const [playerHand, setPlayerHand] = useState([]);
  // const [opponentHand, setOpponentHand] = useState([]);
  const [selectedCard, setSelectedCard] = useState();

  const {
    opponentHand,
    playerHand,
    summon,
    opponentField,
    playerField,
    opponenLifePoints,
    playerLifePoints,
  } = useGame({ player, opponent });

  console.log("playerField", playerField);
  console.log("playerHand", playerHand);

  function confirmSummon() {
    if (!monsterToBeSummoned) return;
    console.log(monsterToBeSummoned);

    summon(monsterToBeSummoned);

    setMonsterToBeSummoned(null);
  }

  function handleSummon(card) {
    setMonsterToBeSummoned(card);
  }

  function handleSelectCard(card) {
    //console.log(card);
    setSelectedCard(card);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        background: "rgb(235, 232, 232)",
      }}
    >
      <Modal isOpen={monsterToBeSummoned ?? false}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 200,
            //height: 200,
            background: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: 10,
            padding: 16,
            gap: 16,
          }}
        >
          <button
            style={{
              background: "#fff",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              borderRadius: 4,
              padding: 10,
              cursor: "pointer",
            }}
            onClick={confirmSummon}
          >
            Summon
          </button>
          <button
            style={{
              background: "#fff",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              borderRadius: 4,
              padding: 10,
              cursor: "pointer",
            }}
          >
            Set
          </button>
          <button
            style={{
              background: "#fff",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              borderRadius: 4,
              padding: 10,
              cursor: "pointer",
            }}
            onClick={() => setMonsterToBeSummoned(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <SideBar
        selectedCard={selectedCard || monsterToBeSummoned}
        lifePoints={playerLifePoints}
      />
      <div
        className="field"
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Hand
          side="OPPONENT"
          cards={opponentHand}
          onClickCard={handleSummon}
          handleSelectCard={handleSelectCard}
        />
        <Field
          cards={playerField}
          ocards={opponentField}
          confirmSummon={confirmSummon}
        />
        <Hand
          side="MINE"
          cards={playerHand}
          onClickCard={handleSummon}
          handleSelectCard={handleSelectCard}
        />
      </div>

      <SideBar side="RIGH" lifePoints={opponenLifePoints} />
    </div>
  );
};

export default Game;
