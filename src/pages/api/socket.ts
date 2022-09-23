import { Server } from "Socket.IO";

const SocketHandler = (req, res) => {
  let players = [];

  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    const nickname = socket.handshake.query.nickname;
    // Avoid duplication
    const playerAlreadyExist = players.find(
      (player) => player.nickname === nickname
    );

    //if (playerAlreadyExist) return;

    const player = {
      nickname,
      socket,
      summonedCards: [],
    };

    players.push(player);
    console.log("quantidade de players: ", players.length);

    socket.on("teste", () => {
      io.emit("teste", players.length);
    });

    socket.on("summon", (card) => {
      const player = players.find((player) => player.socket.id === socket.id);

      // player.summonedCards.push(card);
      // const cards = player.summonedCards;

      io.emit("summon", { card, id: socket.id });
    });

    socket.on("destroy", (card) => {
      // const player = players.find((player) => player.socket.id === socket.id);

      // player.summonedCards.push(card);
      // const cards = player.summonedCards;

      io.emit("destroy", { card, id: socket.id });
    });
  };

  // Define actions inside
  io.on("connection", onConnection);
  //io.on("summon", onSummon);

  console.log("Setting up socket");
  res.end();
};
export default SocketHandler;
