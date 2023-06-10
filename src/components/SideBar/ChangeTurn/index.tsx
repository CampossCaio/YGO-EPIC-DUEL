import classNames from "classnames";
import styles from "./styles.module.scss";

export type ChangeTurnProps = {
  onClick: () => void;
  turn: "MINE" | "OPPONENT";
};

export const ChangeTurn = ({ onClick, turn }: ChangeTurnProps) => {
  const isMyTurn = turn === "MINE";

  return (
    <div
      className={classNames(styles.changeTurn, {
        [styles.mine]: isMyTurn,
      })}
    >
      <button disabled={!isMyTurn} onClick={onClick}>
        {isMyTurn ? "Change Turn" : "Opponent's Turn"}
      </button>
    </div>
  );
};
