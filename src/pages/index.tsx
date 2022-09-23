import type { NextPage } from "next";

import { useEffect, useState, useRef } from "react";

import styles from "./menu.module.scss";

import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../assets/images/logo.png";

const Home: NextPage = () => {
  const [nickName, setNickname] = useState("");
  const [deck, setDeck] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const promptRef = useRef(null);

  function gotToGame() {
    router.push("/game", { query: { nickName, deck } });
  }

  function handlePlay() {
    //router.push("/game", { query: { nickName, deck } });
    setShowModal(true);
  }

  function catchPrompt(e: any) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    // Stash the event so it can be triggered later.
    promptRef.current = e;
  }

  function handleInstall() {
    // Show the prompt
    promptRef.current?.prompt();

    // Wait for the user to respond to the prompt
    promptRef.current?.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      promptRef.current = null;
    });
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", catchPrompt);

    return () => window.removeEventListener("beforeinstallprompt", catchPrompt);
  }, []);

  return (
    <>
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
            background: "rgba(0, 0 ,0 ,0.9)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              border: "1px solid #0fe2ee",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3>Welcome!</h3>
            <label htmlFor="nickname">How can I call you? </label>
            <input
              id="nickname"
              style={{
                background: "none",
                border: "1px solid #0fe2ee",
                color: "#fff",
                outline: "none",
                fontSize: 12,
                padding: 10,
                width: "92%",
                marginTop: 20,
                borderRadius: 5,
                marginBottom: 20,
              }}
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              placeholder="Type your nickname"
            />
            <span>Choose your starting character </span>
            <div
              style={{
                marginTop: 20,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <label>
                <input type="radio" />
                Yugi Muto
              </label>
              <label>
                <input type="radio" />
                Seto Kaiba
              </label>
            </div>

            <div
              style={{
                marginTop: 20,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <button onClick={gotToGame} className={styles.button}>
                Start
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.button}
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.menu}>
        <div
          style={{
            width: "100%",
            maxWidth: 300,
            marginBottom: 30,
            //overflow: "hidden",
          }}
        >
          <Image
            src={logo}
            //layout="responsive"
            alt="YU-GI-OH EPIC DUEL"
            //objectFit="cover"
          />
        </div>
        <div>
          <button onClick={handlePlay}>Play</button>
          <button>Deck Manager</button>
          <button>Settings</button>
          <button>About</button>
          <button onClick={handleInstall}>Install</button>
        </div>
      </div>
    </>
  );
};

export default Home;
