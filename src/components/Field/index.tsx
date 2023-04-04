import { PlayMat } from "../PlayMat";

export type FieldProps = {
  cards: Array<any>;
  confirmSummon: (index: number) => void;
  ocards: Array<any>;
};

const opponentCardBox = new Array(14).fill(null);

export const Field = ({ cards, ocards, confirmSummon }: FieldProps) => {
  console.log("openent on field", ocards);
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
      <PlayMat cards={ocards} side="OPPONENT" confirmSummon={() => {}} />
      <div style={{ height: 40 }}></div>
      <PlayMat cards={cards} confirmSummon={confirmSummon} />
    </div>
  );
};
