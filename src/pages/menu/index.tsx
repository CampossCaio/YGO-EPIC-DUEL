import { useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";

import styles from "./styles.module.scss";
import useApplication from "../../hooks/useApplication";

enum MENU_SECTION {
  MAIN = "MAIN",
  MATCH = "MATCH",
  CHARACTER = "CHARACTER",
}

const menuLabel = {
  MAIN: "Main Menu",
  MATCH: "Multplayer",
  CHARACTER: "Select a deck",
};

const Menu = () => {
  const [menuSection, setMenuSection] = useState(MENU_SECTION.MAIN);
  const { setSelectedDeck } = useApplication();

  const router = useRouter();

  function handleSelectDeck(id: number) {
    setSelectedDeck(id);
    router.push("duel");
  }
  return (
    <div className={styles.container}>
      <header>
        <h1>{menuLabel[menuSection]}</h1>
      </header>

      <div className={styles.buttons}>
        {menuSection === MENU_SECTION.MAIN ? (
          <>
            <button onClick={() => setMenuSection(MENU_SECTION.MATCH)}>
              Online
            </button>
            <button disabled>Deck Manager</button>
            <button disabled>Settings</button>
            <button disabled>About</button>
            <button onClick={() => router.push("/")}>Exit</button>
          </>
        ) : menuSection === MENU_SECTION.MATCH ? (
          <>
            <button disabled>Ranked Match</button>
            <button onClick={() => setMenuSection(MENU_SECTION.CHARACTER)}>
              Player Match
            </button>
            <button disabled>Local Match</button>
            <button onClick={() => setMenuSection(MENU_SECTION.MAIN)}>
              Go Back
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleSelectDeck(0)}>Seto Kaiba</button>
            <button disabled>Yugi Muto</button>
            <button disabled>Joey Wheeler</button>
            <button disabled>Tristan Taylor</button>
            <button onClick={() => setMenuSection(MENU_SECTION.MATCH)}>
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Menu;
