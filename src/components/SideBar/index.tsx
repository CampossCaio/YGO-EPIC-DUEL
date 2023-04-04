import { HealthBar } from "../HealthBar";
import { SelectedCardInfo } from "../SelectedCardInfo";
import styles from "./styles.module.scss";

export type SideBarProps = {
  selectedCard?: any;
  side?: "LEFT" | "RIGH";
  lifePoints: number;
};

export const SideBar = ({
  selectedCard,
  lifePoints,
  side = "LEFT",
}: SideBarProps) => {
  return (
    <div
      className={`${styles.sidebar} ${
        side === "LEFT" ? styles.left : styles.right
      }`}
    >
      {side === "LEFT" && <SelectedCardInfo selectedCard={selectedCard} />}
      <HealthBar lifePoints={lifePoints} />
    </div>
  );
};
