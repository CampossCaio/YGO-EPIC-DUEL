import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Game from "../../@core/game";
import { socket } from "../../services/socket";
import { PHASE } from "../../interfaces/enum";
import useApplication from "../../hooks/useApplication";
import { decks } from "../../database/decks";

enum CARD_POS {
  FACE = "FACE",
  DEFENSE = "DEFENCE",
  SET = "SET",
}

enum SOCKET_EVENTS {
  SUMMON = "summon",
  BATTLE = "battle",
  CHANGE_TURN = "changeTurn",
  CHANGE_CARD_POSITION = "changeCardPosition",
  DRAW = "draw",
  CHANGE_PHASE = "changePhase",
  PLAYERS_READY = "playersReady",
  DIRECT_ATTACK = "directAttack",
  RESET_GAME = "resetGame",
}

export enum SIDE {
  OPPONENT = "OPPONENT",
  MINE = "MINE",
}

type GameProviderProps = {
  children: ReactNode;
};
type GameProviderValues = {
  // Player
  playerHand: any[];
  playerDeck: any[];
  playerField: any[];
  playerGraveyard: any[];
  playerLifePoints: number;

  // Opponent
  opponentHand: any[];
  opponentDeck: any[];
  opponentField: any[];
  opponentGraveyard: any[];
  opponenLifePoints: number;

  // Summon
  summon: (card: any, pos?: string) => void;

  // Battle
  battle: () => void;
  directAttack: any;
  setCardStriker: (cardStriker: any) => void;
  setCardTarget: (cardStriker: any) => void;
  startedAnattack: boolean;
  setStartedAnattack: any;
  isMonsterActionsModalOpen: boolean;
  setIsMonsterActionsModalOpen: any;

  // game
  duelistTurn: any;
  playerId: any;
  duelists: any[];
  changeTurn: any;
  hasSummonedInThisTurn: boolean;
  gameOver: boolean;
  firstTurn: boolean;
  resetGame: () => void;

  // notify
  turnChanged: boolean;

  // card
  changeCardPosition: (card: any, pos: string) => void;
  selectedCard: any;
  setSelectedCard: any;
  draw: any;
  phase: PHASE;
  changePhase: any;

  // socket
  disconnect: () => void;
};

export const GameContext = createContext({} as GameProviderValues);

export default function GameProvider({ children }: GameProviderProps) {
  const [updated, setUpdated] = useState(false);
  const [duelists, setDuelists] = useState<any[]>([]);
  const [playerId, setPlayerId] = useState("");

  const [playerHand, setPlayerHand] = useState([]);
  const [playerField, setPlayerField] = useState([]);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [playerGraveyard, setPlayerGraveyard] = useState([]);
  const [playerLifePoints, setPlayerLifePoints] = useState(0);

  const [opponentHand, setOpponentHand] = useState([]);
  const [opponentField, setOpponentField] = useState([]);
  const [opponentDeck, setOpponentDeck] = useState([]);
  const [opponentGraveyard, setOpponentGraveyard] = useState([]);
  const [opponenLifePoints, setOpponenLifePoints] = useState(0);

  // cards
  const [selectedCard, setSelectedCard] = useState(null);

  // monsters actions
  const [isMonsterActionsModalOpen, setIsMonsterActionsModalOpen] =
    useState(false);

  // battle
  const [cardStriker, setCardStriker] = useState(null);
  const [cardTarget, setCardTarget] = useState(null);

  const [startedAnattack, setStartedAnattack] = useState(false);

  // GAME
  const [duelistTurn, setDuelistTurn] = useState();
  const [firstTurn, setFirstTurn] = useState(true);
  const [phase, setPhase] = useState<PHASE>(PHASE.DRAW);
  const [hasSummonedInThisTurn, SetHasSummonedInThisTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Notify
  const [turnChanged, setTurnChanged] = useState(false);

  const timerRef = useRef<any>(null);

  const { selectedDeck } = useApplication();

  // init and update the game
  useEffect(() => {
    console.log("Opa");
    console.log("duelists.length", duelists.length);
    if (duelists.length !== 2) return;

    // if updated is true, it gets the new game's state vaue
    if (updated) return;

    const {
      playerData,
      oppnentData,
      turn,
      firstTurn,
      phase,
      hasSummonedInThisTurn,
      gameOver,
    } = Game.init({
      player: {
        id: duelists.find((duelist) => duelist.id === socket.id).id,
        deck: [
          ...decks[duelists.find((duelist) => duelist.id === socket.id).deck],
        ],
      },
      opponent: {
        id: duelists.find((duelist) => duelist.id !== socket.id).id,
        deck: [
          ...decks[duelists.find((duelist) => duelist.id === socket.id).deck],
        ],
      },
      starter: duelistTurn,
    });

    console.log("GAME", {
      player: playerData,
      opponet: oppnentData,
      turn,
      playerId: playerData.id,
    });

    setPlayerHand(playerData.hand);
    setPlayerField(playerData.field);
    setPlayerId(playerData.id);
    setPlayerDeck(playerData.deck);
    setPlayerGraveyard(playerData.graveyard);

    setPlayerLifePoints(playerData.lifePoints);

    setOpponentHand(oppnentData.hand);
    setOpponentField(oppnentData.field);

    setOpponentDeck(oppnentData.deck);
    setOpponentGraveyard(oppnentData.graveyard);

    setOpponenLifePoints(oppnentData.lifePoints);

    setDuelistTurn(turn);
    setFirstTurn(firstTurn);
    setPhase(phase);
    SetHasSummonedInThisTurn(hasSummonedInThisTurn);
    setGameOver(gameOver);

    setUpdated(true);
  }, [duelistTurn, duelists, updated]);

  // start socket
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected) return;
    fetch("api/socket").then(() => {
      setConnected(true);
    });
  });

  function showTurnChangeAnimation() {
    setTurnChanged(true);
    timerRef.current = setTimeout(() => setTurnChanged(false), 1000);
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const onSummon = useCallback((data) => {
    const { id, card, pos } = data;

    const side = socket.id === id ? SIDE.MINE : SIDE.OPPONENT;

    Game.summon(card, pos, side);
    setUpdated(false);
  }, []);

  const onBattle = useCallback((data) => {
    const { cardStriker, cardTarget, id } = data;

    const side = socket.id === id ? SIDE.MINE : SIDE.OPPONENT;

    Game.battle({
      cardStriker,
      cardTarget,
      sideStriker: side,
    });

    setUpdated(false);
  }, []);

  const onPlayersReady = useCallback(({ players, turn }) => {
    console.log("players:", players);
    console.log("turn:", turn);
    const me = players.filter((player) => player.id === socket.id);

    console.log("Esse sou eu:", me);
    setDuelists(players);
    setDuelistTurn(turn);
  }, []);

  const onChangeTurn = useCallback((turn: any) => {
    const side = socket.id === turn ? SIDE.MINE : SIDE.OPPONENT;
    setDuelistTurn(turn);
    Game.changeTurn(turn);
    showTurnChangeAnimation();

    Game.draw({ side });
    Game.changePhase(PHASE.MAIN);

    setUpdated(false);
  }, []);

  const onChangeCardPosition = useCallback((data: any) => {
    const { card, pos, id } = data;

    const side = socket.id === id ? SIDE.MINE : SIDE.OPPONENT;

    Game.changeCardPosition({
      card,
      pos,
      side,
    });

    setUpdated(false);
  }, []);

  const onDraw = useCallback((data: any) => {
    const { side } = data;

    const test = side === socket.id ? SIDE.MINE : SIDE.OPPONENT;

    Game.draw({
      side: test,
    });

    changePhase(PHASE.MAIN);

    setUpdated(false);
  }, []);

  const onChangePhase = useCallback((data: any) => {
    const { phase } = data;
    Game.changePhase(phase);
    setUpdated(false);
  }, []);

  const onDirectAttack = useCallback((data: any) => {
    const { cardStriker, id } = data;
    const side = socket.id === id ? SIDE.MINE : SIDE.OPPONENT;

    Game.directAttack({
      cardStriker,
      sideStriker: side,
    });

    setUpdated(false);
  }, []);

  const onResetGame = useCallback(({ players }: any) => {
    setDuelists(players);
    Game.resetGame();
    disconnect();
    setConnected(false);
    setUpdated(false);
  }, []);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      socket.emit("playerConect", { deck: selectedDeck });
    }

    socket.on("connect", onConnect);
    socket.on(SOCKET_EVENTS.PLAYERS_READY, onPlayersReady);
    socket.on(SOCKET_EVENTS.CHANGE_TURN, onChangeTurn);

    socket.on(SOCKET_EVENTS.SUMMON, onSummon);
    socket.on(SOCKET_EVENTS.BATTLE, onBattle);
    socket.on(SOCKET_EVENTS.CHANGE_CARD_POSITION, onChangeCardPosition);
    socket.on(SOCKET_EVENTS.DRAW, onDraw);
    socket.on(SOCKET_EVENTS.CHANGE_PHASE, onChangePhase);
    socket.on(SOCKET_EVENTS.DIRECT_ATTACK, onDirectAttack);
    socket.on(SOCKET_EVENTS.RESET_GAME, onResetGame);

    return () => {
      socket.off("connect", onConnect);

      socket.off(SOCKET_EVENTS.CHANGE_TURN, onChangeTurn);
      socket.off(SOCKET_EVENTS.PLAYERS_READY, onPlayersReady);
      socket.off(SOCKET_EVENTS.SUMMON, onSummon);
      socket.off(SOCKET_EVENTS.BATTLE, onBattle);
      socket.off(SOCKET_EVENTS.CHANGE_CARD_POSITION, onChangeCardPosition);
      socket.off(SOCKET_EVENTS.DRAW, onDraw);
      socket.off(SOCKET_EVENTS.CHANGE_PHASE, onChangePhase);
      socket.off(SOCKET_EVENTS.DIRECT_ATTACK, onDirectAttack);
      socket.off(SOCKET_EVENTS.RESET_GAME, onResetGame);
    };
  }, [
    onBattle,
    onChangeCardPosition,
    onChangePhase,
    onChangeTurn,
    onDirectAttack,
    onDraw,
    onPlayersReady,
    onResetGame,
    onSummon,
    selectedDeck,
  ]);

  function disconnect() {
    socket.disconnect();
  }

  // end socket
  const summon = (card: any, pos = "FACE") => {
    socket.emit(SOCKET_EVENTS.SUMMON, { card, pos });
  };

  const battle = () => {
    socket.emit(SOCKET_EVENTS.BATTLE, { cardStriker, cardTarget });
  };

  const directAttack = (cardStriker: any) => {
    socket.emit(SOCKET_EVENTS.DIRECT_ATTACK, { cardStriker });
  };

  const changeTurn = () => {
    socket.emit(SOCKET_EVENTS.CHANGE_TURN);
  };

  const changeCardPosition = (card: any, pos: string) => {
    socket.emit(SOCKET_EVENTS.CHANGE_CARD_POSITION, { card, pos });
  };

  const draw = (side: SIDE) => {
    socket.emit(SOCKET_EVENTS.DRAW, { side });
  };

  const changePhase = (phase: PHASE) => {
    socket.emit(SOCKET_EVENTS.CHANGE_PHASE, { phase });
  };

  const resetGame = () => {
    socket.emit(SOCKET_EVENTS.RESET_GAME);
  };

  return (
    <GameContext.Provider
      value={{
        playerHand,
        playerDeck,
        playerField,
        playerGraveyard,
        opponentHand,
        opponentDeck,
        opponentField,
        opponentGraveyard,
        summon,
        opponenLifePoints,
        playerLifePoints,
        battle,
        setCardStriker,
        setCardTarget,
        setStartedAnattack,
        startedAnattack,
        isMonsterActionsModalOpen,
        setIsMonsterActionsModalOpen,
        duelistTurn,
        firstTurn,
        playerId,
        duelists,
        changeTurn,
        turnChanged,
        changeCardPosition,
        selectedCard,
        setSelectedCard,
        draw,
        phase,
        changePhase,
        hasSummonedInThisTurn,
        gameOver,
        directAttack,
        disconnect,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
