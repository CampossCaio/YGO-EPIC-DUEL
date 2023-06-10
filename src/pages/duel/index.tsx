import { NextPage } from "next";

import GameProvider from "../../contexts/GameContext";
import { Main } from "../../components/Main";

const Game: NextPage = () => {
  return (
    <GameProvider>
      <Main />
    </GameProvider>
  );
};

export default Game;
