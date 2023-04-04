const DEFAULT_LIFEPOINTS = 4000;

type GameConfig = {
  player: any;
  opponent: any;
};

class Game {
  // Player;
  public player: any;

  // Opponent;
  public opponent: any;

  // GAME
  public isAlreadyInitialized: boolean = false;

  /**
   * Start the Game Engine
   * @param {GameConfig} config - The game config.
   */
  init(config: GameConfig) {
    if (this.isAlreadyInitialized)
      return {
        playerData: this.player,
        oppnentData: this.opponent,
      };

    this.player = {
      deck: config.player.deck,
      lifePoints: DEFAULT_LIFEPOINTS,
      hand: this.generateHand(config.player.deck),
      graveyard: [],
      field: [],
    };

    this.opponent = {
      deck: config.opponent.deck,
      lifePoints: DEFAULT_LIFEPOINTS,
      hand: this.generateHand(config.opponent.deck),
      graveyard: [],
      field: [
        {
          id: "23995346",
          name: "Blue-Eyes Ultimate Dragon",
          att: 4500,
          def: 3800,
          pos: "FACE",
          image: "/images/cards/kaiba_deck/23995346.jpg",
        },
        {
          id: "89631139",
          name: "Blue-Eyes White Dragon",
          att: 3000,
          def: 2500,
          pos: "FACE",
          image: "images/cards/kaiba_deck/89631139.jpg",
        },
        {
          id: "2111707",
          name: "XY-Dragon Cannon",
          att: 2200,
          def: 1900,
          pos: "DEFENSE",
          image: "/images/cards/kaiba_deck/2111707.jpg",
        },
      ],
    };

    this.isAlreadyInitialized = true;

    return {
      playerData: this.player,
      oppnentData: this.opponent,
    };
  }

  private generateHand(deck: any) {
    return this.getRandomCards(deck, 5);
  }

  private getRandomCard(deck: []) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    return deck[cardIndex];
  }

  private getRandomCards = (deck: [], max: number) => {
    let filteredDeck = deck;
    let cards: unknown[] = [];

    for (let i = 0; i < max; ++i) {
      const card = this.getRandomCard(filteredDeck);
      cards.push(card);
      // Remove the card card from deck
      filteredDeck.splice(filteredDeck.indexOf(card), 1);
    }
    return cards;
  };

  summon(card: any) {
    this.player.field.push(card);
    const filteredhand = this.player.hand.filter((c: any) => c.id !== card.id);
    this.player.hand = filteredhand;
  }
}

export default new Game();
