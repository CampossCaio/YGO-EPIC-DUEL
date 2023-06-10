import useGame from "../../hooks/useGame";
import { HealthBar } from "../HealthBar";
import { SelectedCardInfo } from "../SelectedCardInfo";
import { ChangeTurn } from "./ChangeTurn";
import styles from "./styles.module.scss";

export type SideBarProps = {
  selectedCard?: any;
  side?: "LEFT" | "RIGH";
};

export const SideBar = ({ selectedCard, side = "LEFT" }: SideBarProps) => {
  const { changeTurn, duelistTurn, playerId } = useGame();

  return (
    <div
      className={`${styles.sidebar} ${
        side === "LEFT" ? styles.left : styles.right
      }`}
    >
      {side === "LEFT" && <SelectedCardInfo selectedCard={selectedCard} />}

      <HealthBar side={side} />
      {side === "RIGH" && (
        <ChangeTurn
          turn={playerId === duelistTurn ? "MINE" : "OPPONENT"}
          onClick={changeTurn}
        />
      )}
    </div>
  );
};
