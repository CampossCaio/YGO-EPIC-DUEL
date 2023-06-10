import { FC } from "react";
import GameProvider from "../../contexts/GameContext";

const WithGameContext = (Component: FC) => {
  return (
    <GameProvider>
      <Component />
    </GameProvider>
  );
};
export default WithGameContext;
