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

  const summon = (card: any, pos = "FACE") => {
    Game.summon(card, pos);
    setPlayerHand(Game.player.hand);
  };

  const battle = (cardStriker: any, cardTarget: any, sideStriker: any) => {
    Game.battle({
      cardStriker,
      cardTarget,
      sideStriker,
    });

    setPlayerLifePoints(Game.player.lifePoints);
    setOpponenLifePoints(Game.opponent.lifePoints);
  };

  return {
    playerHand,
    playerField,
    opponentHand,
    opponentField,
    summon,
    opponenLifePoints,
    playerLifePoints,
    battle,
  };
};
export default useGame;
