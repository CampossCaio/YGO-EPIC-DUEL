import useGame from "../../hooks/useGame";
import { PlayMat } from "../PlayMat";

export type FieldProps = {
  battle: (args: any) => void;
};

export const Field = ({ battle }: FieldProps) => {
  const {
    playerField,
    opponentField,
    playerGraveyard,
    playerDeck,
    opponentDeck,
    opponentGraveyard,
  } = useGame();
  return (
    <div
      className="playMatContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: "perspective(1000px) rotateX(50deg) scale(1,1)",
        marginBottom: 150,
      }}
    >
      <PlayMat
        graveyardCards={opponentGraveyard}
        deckCards={opponentDeck}
        fieldCards={opponentField}
        side="OPPONENT"
      />
      <div style={{ height: 40 }}></div>
      <PlayMat
        graveyardCards={playerGraveyard}
        deckCards={playerDeck}
        fieldCards={playerField}
        battle={battle}
      />
    </div>
  );
};
