import { useCallback, useEffect, useRef, useState } from "react";
import { Field } from "../../components/Field";
import { Hand } from "../../components/Hand";
import { SideBar } from "../../components/SideBar";
import useGame from "../../hooks/useGame";
import { Modal } from "../../components/Modal";
import { OpponentFieldModal } from "../../components/Modal/OpponentFieldModal";
import { MonsterActionsModal } from "../../components/Modal/MonsterActionsModal";
import { NotifyModal } from "../../components/Modal/NotifyModal";
import { PHASE } from "../../interfaces/enum";

import styles from "./styles.module.scss";
import { GameOverModal } from "../../components/Modal/GameOverModal";
import { useRouter } from "next/router";

export const Main = () => {
  const [monsterToBeSummoned, setMonsterToBeSummoned] = useState(null);

  const [showDuelNotification, setshowDuelNotification] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const router = useRouter();

  const {
    summon,
    battle,
    duelistTurn,
    playerId,
    duelists,
    turnChanged,
    selectedCard,
    setSelectedCard,
    phase,
    hasSummonedInThisTurn,
    gameOver,
    playerLifePoints,
    resetGame,
  } = useGame();

  useEffect(() => {
    if (duelists.length < 2) return;
    const timer = setTimeout(() => {
      setshowDuelNotification(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [duelists.length]);

  const onGameOver = useCallback(() => {
    setShowGameOverModal(true);

    timerRef.current = setTimeout(() => {
      router.push("menu");
      resetGame();
    }, 4000);
  }, [resetGame, router]);

  useEffect(() => {
    if (gameOver) {
      onGameOver();
    }
    return () => clearTimeout(timerRef.current);
  }, [gameOver, onGameOver]);

  function confirmSummon(isPosSet = false) {
    if (!monsterToBeSummoned) return;

    if (isPosSet) {
      summon(monsterToBeSummoned, "SET");
    } else {
      {
        summon(monsterToBeSummoned);
      }
    }

    setMonsterToBeSummoned(null);
  }

  function isMyTurn() {
    return duelistTurn === playerId;
  }

  function handleSummon(card) {
    if (!isMyTurn()) return;

    if (!(phase === PHASE.MAIN)) return;

    setMonsterToBeSummoned(card);
  }

  function handleSelectCard(card) {
    setSelectedCard(card);
  }

  if (duelists.length < 2) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          color: "var(--colors-grey-100)",
          fontSize: 24,
        }}
      >
        Looking for an opponent...
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Modal isOpen={monsterToBeSummoned ?? false}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 200,
            //height: 200,
            background: "var(--colors-shape-secondary)",
            border: "1px solid var(--colors-grey-500)",
            borderRadius: 10,
            padding: 16,
            gap: 16,
          }}
        >
          {!hasSummonedInThisTurn && (
            <>
              <button
                style={{
                  background: "var(--colors-shape-tertiary)",
                  border: 0,
                  color: "var(--colors-grey-100)",
                  fontWeight: "bold",
                  borderRadius: 4,
                  padding: 10,
                  cursor: "pointer",
                }}
                onClick={() => confirmSummon(false)}
              >
                Summon
              </button>
              <button
                style={{
                  background: "var(--colors-shape-tertiary)",
                  border: 0,
                  color: "var(--colors-grey-100)",
                  fontWeight: "bold",
                  borderRadius: 4,
                  padding: 10,
                  cursor: "pointer",
                }}
                onClick={() => confirmSummon(true)}
              >
                Set
              </button>
            </>
          )}
          <button
            style={{
              background: "var(--colors-shape-tertiary)",
              border: 0,
              color: "var(--colors-grey-100)",
              fontWeight: "bold",
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
      <OpponentFieldModal />
      <GameOverModal
        opened={showGameOverModal}
        status={playerLifePoints < 0 ? "loser" : "winner"}
      />
      <MonsterActionsModal />
      <NotifyModal opened={showDuelNotification} text="Duel!" />
      <NotifyModal
        opened={turnChanged}
        text={isMyTurn() ? "Your turn!" : "Turn Change!"}
        animation="slide"
      />
      <SideBar selectedCard={selectedCard || monsterToBeSummoned} />
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
          onClickCard={handleSummon}
          handleSelectCard={handleSelectCard}
        />
        <Field battle={battle} />
        <Hand
          side="MINE"
          onClickCard={handleSummon}
          handleSelectCard={handleSelectCard}
        />
      </div>

      <SideBar side="RIGH" />
    </div>
  );
};
