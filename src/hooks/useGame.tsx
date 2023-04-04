import { useEffect, useState } from "react";
import Game from "../@core/game";

const useGame = ({ player, opponent }) => {
  const [playerHand, setPlayerHand] = useState([]);
  const [playerField, setPlayerField] = useState([]);
  const [playerLifePoints, setPlayerLifePoints] = useState(0);

  const [opponentHand, setOpponentHand] = useState([]);
  const [opponentField, setOpponentField] = useState([]);
  const [opponenLifePoints, setOpponenLifePoints] = useState(0);

  useEffect(() => {
    console.log("Renderizei");
    const { playerData, oppnentData } = Game.init({
      player,
      opponent,
    });

    setPlayerHand(playerData.hand);
    setPlayerField(playerData.field);
    setPlayerLifePoints(playerData.lifePoints);

    setOpponentHand(oppnentData.hand);
    setOpponentField(oppnentData.field);
    setOpponenLifePoints(oppnentData.lifePoints);
  }, [opponent, player]);

  const summon = (card: any) => {
    Game.summon(card);
    setPlayerHand(Game.player.hand);
  };

  return {
    playerHand,
    playerField,
    opponentHand,
    opponentField,
    summon,
    opponenLifePoints,
    playerLifePoints,
  };
};
export default useGame;
