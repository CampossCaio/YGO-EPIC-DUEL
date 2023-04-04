import { DefaultEventsMap } from "@socket.io/component-emitter";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import styles from "./game.module.scss";
import image from "../assets/images/kaiba.png";

import Image from "next/image";

import decks from "../../decks.json";

const Home: NextPage = () => {
  const router = useRouter();

  const deck = Number(router.asPath.split("=")[2]);
  const [cards, setCards] = useState(decks[0].cards.slice(0, 4));

  const [summonedCards, setSummonedCards] = useState([]);
  const [summonedCardsPlayer2, setSummonedCardsPlayer2Mock] = useState([]);

  const [attackerCard, setAttackerCard] = useState();
  const [showModal, setShowModal] = useState(false);

  const [selectedCard, setSelectedCard] = useState();
  const [player1Pv, setPlayer1Pv] = useState(4000);
  const [player2Pv, setPlayer2Pv] = useState(4000);
  const [players, setPlayers] = useState(0);

  // Phases
  // 1 - summon
  // 2 - attack
  // 3
  const [phase, setPhase] = useState(1);

  function summonCard(card: any) {
    socket.emit("summon", card);
    //setSummonedCards([...summonedCards, card]);
    const filteredCards = cards.filter((c) => c.id != card.id);
    setCards(filteredCards);
    setShowModal(false);
  }

  function handleSummon(card) {
    setShowModal(true);
    setSelectedCard(card);
    setPhase(1);
  }

  function handleClickOnP2Card(card) {
    setShowModal(true);
    setSelectedCard(card);

    if (phase !== 3) {
      setPhase(0);
    }
  }

  function handleModalConfirm(card) {
    if (phase === 1) {
      summonCard(card);
    } else if (phase === 2) {
      setAttackerCard(card);
      setPhase(3);
      setShowModal(false);
    } else {
      attack(card);
      setShowModal(false);
    }
  }

  function handleAttack(card) {
    setShowModal(true);
    setSelectedCard(card);
    setPhase(2);
  }

  function destroyCard(card) {
    socket.emit("destroy", card);
  }

  function attack(targetCard) {
    console.log("attackerCard", attackerCard);
    console.log("targetCard", targetCard);
    const result = attackerCard.att - targetCard.att;

    alert(result);

    if (result > 0) {
      destroyCard(targetCard);
      setPlayer2Pv(player2Pv - result);
    } else if (result < 0) {
      destroyCard(attackerCard);
      setPlayer2Pv(player1Pv - result * -1);
    }
  }

  useEffect(() => {
    const socketInitializer = async () => {
      //const nickname = prompt("Digite seu nickname: ");

      console.log(router.asPath.split("=")[2]);

      await fetch("/api/socket");

      socket.emit("teste");

      socket.on("teste", (data) => {
        console.log("players:", data);
        setPlayers(data);
      });

      socket.on("summon", (obj) => {
        if (obj.id === socket.id) {
          setSummonedCards([...summonedCards, obj.card]);
        } else {
          setSummonedCardsPlayer2Mock([...summonedCardsPlayer2, obj.card]);
        }
      });

      socket.on("destroy", (obj) => {
        console.log("obj,", obj);

        if (obj.id === socket.id) {
          const summonedCard = summonedCards.find(
            (card) => card.id === obj.card.id
          );

          if (summonedCard) {
            setSummonedCards(
              summonedCards.filter((card) => card.id !== summonedCard.id)
            );
          } else {
            setSummonedCardsPlayer2Mock(
              summonedCardsPlayer2.filter((card) => card.id !== obj.card.id)
            );
          }
        } else {
          const summonedCardPlayer2 = summonedCardsPlayer2.find(
            (card) => card.id === obj.card.id
          );

          if (summonedCardPlayer2) {
            setSummonedCardsPlayer2Mock(
              summonedCardsPlayer2.filter(
                (card) => card.id !== summonedCardPlayer2.id
              )
            );
          } else {
            setSummonedCards(
              summonedCards.filter((card) => card.id !== obj.card.id)
            );
          }
        }

        // if (obj.id) {
        //   console.log("summonedCards", summonedCards);
        //   const filteredCards = summonedCards.filter(
        //     (card) => card.id !== obj.card.id
        //   );
        //   console.log("filteredCards", filteredCards);
        //   setSummonedCards(filteredCards);
        // } else {
        //   const filteredCards = summonedCardsPlayer2.filter(
        //     (card) => card.id !== obj.card.id
        //   );
        //   setSummonedCardsPlayer2Mock(filteredCards);
        // }
      });
    };

    socketInitializer();

    // return () => {
    //   socket?.off("connect", () => {
    //     socket.emit("test", "Hello World!");
    //   });

    //   socket?.off("summon", (obj) => {
    //     if (obj.id === socket.id) {
    //       setSummonedCards([...summonedCards, obj.card]);
    //     } else {
    //       setSummonedCardsPlayer2Mock([...summonedCardsPlayer2, obj.card]);
    //     }
    //   });

    //   socket?.off("destroy", (obj) => {
    //     if (obj.id === socket.id) {
    //       console.log("summonedCards", summonedCards);
    //       const filteredCards = summonedCards.filter(
    //         (card) => card.id !== obj.card.id
    //       );
    //       console.log("filteredCards", filteredCards);
    //       setSummonedCards(filteredCards);
    //     } else {
    //       const filteredCards = summonedCardsPlayer2.filter(
    //         (card) => card.id !== obj.card.id
    //       );
    //       setSummonedCardsPlayer2Mock(filteredCards);
    //     }
    //   });
    // };
  }, [router.asPath, summonedCards, summonedCardsPlayer2, setPlayers]);

  return (
    <>
      <Head>
        <title>Game Card</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {showModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0 ,0 ,0.7)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff",
              border: "1px solid #0fe2ee",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                border: "1px solid white",
                height: 300,
                width: 200,
                cursor: "pointer",
                background: `center / cover url(${selectedCard.image})`,
                borderRadius: 5,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 12,
                color: "#fff",
                marginTop: 10,
                width: "100%",
              }}
            >
              <span
                style={{
                  marginBottom: 10,
                }}
              >
                {selectedCard.name}
              </span>
              <span>Attack: {selectedCard.att}</span>
              <span>Defense: {selectedCard.def}</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "1px solid red",
                    color: "#fff",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {phase !== 0 && (
                  <button
                    style={{
                      background: "none",
                      border: "1px solid #0fe2ee",
                      color: "#fff",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => handleModalConfirm(selectedCard)}
                  >
                    {phase === 1
                      ? "Summon"
                      : phase === 2
                      ? "Atack"
                      : phase === 3
                      ? "Attack this card"
                      : ""}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.container}>
        {players < 2 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0 ,0 ,0.7)",
              zIndex: 10,
              color: "#fff",
            }}
          >
            Aguardando outro jogador...
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                //border: "2px solid blue",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Array.from([1, 2, 3, 4]).map((item) => (
                  <div
                    className={styles.p2cards}
                    key={item}
                    style={{
                      height: 80,
                      width: 50,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginRight: 10,
                  }}
                >
                  <Image
                    src={image}
                    layout="responsive"
                    alt="player"
                    objectFit="cover"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#fff", marginBottom: 5 }}>
                    Jogador 2
                  </span>
                  <span style={{ color: "#fff" }}>LP {player2Pv}</span>
                </div>
              </div>
            </div>
            <div
              style={{
                height: 400,
                width: "100%",
                // border: "2px solid red",
              }}
            >
              <div
                style={{
                  height: 200,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  className={styles.p2cards}
                  style={{
                    height: 80,
                    width: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#fff",
                  }}
                >
                  6
                </div>
                {summonedCardsPlayer2.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid white",
                      height: 80,
                      width: 50,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: "column",
                      fontSize: 10,
                      background: `center / cover url(${card.image})`,
                    }}
                    onClick={() => handleClickOnP2Card(card)}
                  >
                    <div
                      style={{
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        fontSize: 10,
                        position: "relative",
                        bottom: -10,
                        //right: -10,
                        zIndex: 1,
                        background: "rgba(0, 0, 0, 0.5)",
                        width: 60,
                      }}
                    >
                      <span>atk: {card.att}</span>
                      <span>{card.def}</span>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    //border: "1px solid blue",
                    height: 80,
                    width: 50,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                />
              </div>

              <div
                style={{
                  height: 200,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    //border: "1px solid blue",
                    height: 80,
                    width: 50,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                />
                {summonedCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid white",
                      height: 80,
                      width: 50,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: "column",
                      fontSize: 10,
                      background: `center / cover url(${card.image})`,
                    }}
                    onClick={() => handleAttack(card)}
                  >
                    <div
                      style={{
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        fontSize: 10,
                        position: "relative",
                        bottom: -10,
                        //right: -10,
                        zIndex: 1,
                        background: "rgba(0, 0, 0, 0.5)",
                        width: 60,
                      }}
                    >
                      <span>atk: {card.att}</span>
                      <span>{card.def}</span>
                    </div>
                  </div>
                ))}
                <div
                  className={styles.p2cards}
                  style={{
                    height: 80,
                    width: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#fff",
                  }}
                >
                  {cards.length}
                </div>
              </div>
            </div>
            <div
              style={{
                // border: "2px solid blue",
                height: 200,
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginRight: 10,
                  }}
                >
                  <Image
                    src={image}
                    layout="responsive"
                    alt="player"
                    objectFit="cover"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#fff", marginBottom: 5 }}>
                    Jogador 1
                  </span>
                  <span style={{ color: "#fff" }}>LP {player1Pv}</span>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid white",
                      height: 80,
                      width: 50,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      fontSize: 10,
                      background: `center / cover url(${card.image})`,
                    }}
                    onClick={() => handleSummon(card)}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
