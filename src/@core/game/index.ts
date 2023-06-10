const DEFAULT_LIFEPOINTS = 4000;

enum CARD_POS {
  FACE = "FACE",
  DEFENSE = "DEFENSE",
  SET = "SET",
}

enum SIDE {
  OPPONENT = "OPPONENT",
  MINE = "MINE",
}

export enum CARD_PLACE {
  DECK = "DECK",
  HAND = "HAND",
  FIELD = "FIELD",
  GRAVEYARD = "GRAVEYARD",
}

export enum TURN {
  PLAYER = "PLAYER",
  OPPONENT = "OPPONENT",
}

interface ICard {
  id: string;
  name: string;
  att: 4500;
  def: 3800;
  pos: string;
  place: CARD_PLACE;
  image: string;
  hasAttacked: boolean;
  hasChangedPosition: boolean;
}

type GameConfig = {
  player: any;
  opponent: any;
  starter: any;
};

type BettleParams = {
  cardStriker: ICard;
  cardTarget: ICard;
  sideStriker: "OPPONENT" | "MINE";
};

type DirectAttackParams = {
  cardStriker: ICard;
  sideStriker: "OPPONENT" | "MINE";
};

type ChangeCardPositionParams = {
  card: ICard;
  pos: CARD_POS;
  side: SIDE;
};

type DrawParams = {
  side: SIDE;
};

enum PHASE {
  DRAW = "DRAW",
  MAIN = "MAIN",
  BATTLE = "BATTLE",
}

class Game {
  // Player;
  public player: any;

  // Opponent;
  public opponent: any;

  // GAME
  public isAlreadyInitialized: boolean = false;

  // Turn
  public turn: any;
  public firstTurn = true;
  public hasSummonedInThisTurn = false;

  // phase
  public phase: PHASE = PHASE.DRAW;

  /**
   * Start the Game Engine
   * @param {GameConfig} config - The game config.
   */
  init(config: GameConfig) {
    if (this.isAlreadyInitialized)
      // return the updated data
      return {
        playerData: this.player,
        oppnentData: this.opponent,
        turn: this.turn,
        phase: this.phase,
        hasSummonedInThisTurn: this.hasSummonedInThisTurn,
        gameOver: this.isGameOver(),
        firstTurn: this.firstTurn,
      };

    this.player = {
      id: config.player.id,
      deck: config.player.deck,
      lifePoints: DEFAULT_LIFEPOINTS,
      hand: this.generateHand(config.player.deck),
      graveyard: [],
      field: [],
    };

    this.opponent = {
      id: config.opponent.id,
      deck: config.opponent.deck,
      lifePoints: DEFAULT_LIFEPOINTS,
      hand: this.generateHand(config.opponent.deck),
      graveyard: [],
      field: [],
    };

    this.turn = config.starter;

    // first turn draw
    const side =
      config.starter === config.player.id ? SIDE.MINE : SIDE.OPPONENT;
    this.draw({ side });
    this.changePhase(PHASE.MAIN);

    this.isAlreadyInitialized = true;

    return {
      playerData: this.player,
      oppnentData: this.opponent,
      turn: this.turn,
      phase: this.phase,
      hasSummonedInThisTurn: this.hasSummonedInThisTurn,
      gameOver: this.isGameOver(),
      firstTurn: this.firstTurn,
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

  private normalSummon(card: ICard, pos: string, duelist: any) {
    card.pos = pos;

    duelist.field.push(card);
    duelist.hand = duelist.hand.filter((c: any) => c.id !== card.id);
  }

  summon(card: ICard, pos: string, side: SIDE) {
    if (side === SIDE.MINE) {
      this.normalSummon(card, pos, this.player);
      this.hasSummonedInThisTurn = true;
    } else {
      this.normalSummon(card, pos, this.opponent);
      this.hasSummonedInThisTurn = true;
    }
  }

  sendCardToTheGraveyard(duelist: any, card: ICard) {
    card.pos = CARD_POS.FACE;

    duelist.field = duelist.field.filter((c: any) => c.id !== card.id);

    duelist.graveyard.push(card);
  }

  setCardAsAlreadyHavingAttacked(duelist: any, card: ICard) {
    const index = duelist.field.findIndex((c: ICard) => c.id === card.id);
    duelist.field[index].hasAttacked = true;
  }

  setCardAsAlreadyHavingChangedPosition(duelist: any, card: ICard) {
    const index = duelist.field.findIndex((c: ICard) => c.id === card.id);
    duelist.field[index].hasChangedPosition = true;
  }

  resetCardActions(duelist: any) {
    duelist.field.forEach((card: ICard) => {
      card.hasAttacked = false;
      card.hasChangedPosition = false;
    });
  }

  battle({ cardStriker, cardTarget, sideStriker }: BettleParams) {
    let battleResult;

    const isCardInDefensePos = cardTarget.pos !== CARD_POS.FACE;

    this.changeCardPosition({
      card: cardTarget,
      pos: CARD_POS.FACE,
      side: sideStriker === SIDE.MINE ? SIDE.OPPONENT : SIDE.MINE,
    });

    if (isCardInDefensePos) {
      battleResult = cardStriker.att - cardTarget.def;
    } else {
      battleResult = cardStriker.att - cardTarget.att;
    }

    if (sideStriker === "MINE") {
      this.setCardAsAlreadyHavingAttacked(this.player, cardStriker);

      if (battleResult > 0) {
        if (!isCardInDefensePos) {
          this.opponent.lifePoints -= battleResult;
        }

        this.sendCardToTheGraveyard(this.opponent, cardTarget);
      } else if (battleResult < 0) {
        this.player.lifePoints += battleResult;

        if (!isCardInDefensePos) {
          this.sendCardToTheGraveyard(this.player, cardStriker);
        }
      } else {
        if (!isCardInDefensePos) {
          this.sendCardToTheGraveyard(this.player, cardStriker);
          this.sendCardToTheGraveyard(this.opponent, cardTarget);
        }
      }
    } else {
      if (battleResult > 0) {
        if (!isCardInDefensePos) {
          this.player.lifePoints -= battleResult;
        }

        this.sendCardToTheGraveyard(this.player, cardTarget);
      } else if (battleResult < 0) {
        this.opponent.lifePoints += battleResult;

        if (!isCardInDefensePos) {
          this.sendCardToTheGraveyard(this.opponent, cardStriker);
        }
      } else {
        if (!isCardInDefensePos) {
          this.sendCardToTheGraveyard(this.player, cardStriker);
          this.sendCardToTheGraveyard(this.opponent, cardTarget);
        }
      }
    }
  }

  directAttack({ cardStriker, sideStriker }: DirectAttackParams) {
    console.log("CARD DO MAL", cardStriker);
    if (sideStriker === "MINE") {
      this.opponent.lifePoints -= cardStriker.att;
      this.setCardAsAlreadyHavingAttacked(this.player, cardStriker);
    } else {
      this.player.lifePoints -= cardStriker.att;
      this.setCardAsAlreadyHavingAttacked(this.opponent, cardStriker);
    }
  }

  changeTurn(turn: string) {
    this.turn = turn;
    this.hasSummonedInThisTurn = false;
    this.resetCardActions(this.player);
    this.resetCardActions(this.opponent);

    if (this.firstTurn) {
      this.firstTurn = false;
    }
  }

  changeCardPosition({ card, pos, side }: ChangeCardPositionParams) {
    if (side === SIDE.MINE) {
      const index = this.player.field.findIndex((c) => c.id === card.id);

      this.player.field[index].pos = pos;
      this.setCardAsAlreadyHavingChangedPosition(this.player, card);
    } else {
      const index = this.opponent.field.findIndex((c) => c.id === card.id);
      this.opponent.field[index].pos = pos;
    }
  }

  drawOneCard(duelist: any) {
    if (duelist.deck.length === 0) return;
    const card = this.getRandomCard(duelist.deck);
    duelist.hand.push(card);
    // Remove the card card from deck
    duelist.deck.splice(duelist.deck.indexOf(card), 1);
  }

  draw({ side }: DrawParams) {
    if (side === SIDE.MINE) {
      this.drawOneCard(this.player);
    } else {
      this.drawOneCard(this.opponent);
    }
  }

  changePhase(phase: PHASE) {
    this.phase = phase;
  }

  isGameOver() {
    return this.player.lifePoints <= 0 || this.opponent.lifePoints <= 0;
  }

  resetGame() {
    this.isAlreadyInitialized = false;
  }
}

export default new Game();
