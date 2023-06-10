import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";

const useGame = () => {
  return {
    ...useContext(GameContext),
  };
};
export default useGame;
