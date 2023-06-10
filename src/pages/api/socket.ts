import { Server } from "Socket.IO";

function setTurnRandomly(players: any[]) {
  const playerIndex = Math.floor(Math.random() * players.length);
  return players[playerIndex].id;
}

const socketHandler = (req, res) => {
  const players: any[] = [];
  let turn: any;

  //It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.close;

  const onConnection = (socket) => {
    const nickname = socket.handshake.query.nickname;

    //if (playerAlreadyExist) return;

    if (players.length === 2) {
      return;
    }

    socket.on("playerConect", (data: any) => {
      console.log("player conectado", data);
      const player = {
        id: socket.id,
        deck: data.deck,
      };

      players.push(player);

      if (players.length === 2) {
        turn = setTurnRandomly(players);

        io.emit("playersReady", {
          players,
          turn,
        });
      }
    });

    // if (players.length === 2) {
    //   return;
    // }
    // const player = {
    //   id: socket.id,
    // };

    // players.push(player);

    // if (players.length === 2) {
    //   turn = setTurnRandomly(players);

    //   io.emit("playersReady", {
    //     players,
    //     turn,
    //   });
    // }

    socket.on("changeTurn", () => {
      turn = turn === players[0].id ? players[1].id : players[0].id;

      io.emit("changeTurn", turn);
    });

    socket.on("directAttack", (data: any) => {
      io.emit("directAttack", { ...data, id: socket.id });
    });

    socket.on("changeCardPosition", (data: any) => {
      io.emit("changeCardPosition", { ...data, id: socket.id });
    });

    socket.on("draw", (data: any) => {
      io.emit("draw", { ...data, id: socket.id });
    });

    socket.on("changePhase", (data: any) => {
      io.emit("changePhase", { ...data, id: socket.id });
    });

    console.log("quantidade de players: ", players.length);

    socket.on("summon", (data: any) => {
      // const player = players.find((player) => player.socket.id === socket.id);

      // player.summonedCards.push(card);
      // const cards = player.summonedCards;

      io.emit("summon", { ...data, id: socket.id });
    });

    socket.on("battle", (data: any) => {
      // const player = players.find((player) => player.socket.id === socket.id);

      // player.summonedCards.push(card);
      // const cards = player.summonedCards;

      io.emit("battle", { ...data, id: socket.id });
    });

    socket.on("resetGame", () => {
      const playerIndex = players.findIndex(
        (player) => player.id === socket.id
      );
      players.splice(playerIndex, 1);

      io.emit("resetGame", { players });

      console.log(`Game Over`);
      console.log(`Total de jogadores ${players.length}`);
    });

    socket.on("disconnect", () => {
      const playerIndex = players.findIndex(
        (player) => player.id === socket.id
      );
      players.splice(playerIndex, 1);

      console.log(`O jogador ${socket.id} deixou a sala.`);
      console.log(`Total de jogadores ${players.length}`);

      console.log("res.socket", res.socket);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);
  //io.on("summon", onSummon);

  console.log("Setting up socket");
  res.end();
};
export default socketHandler;
