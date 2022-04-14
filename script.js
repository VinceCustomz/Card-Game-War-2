const SUITS = ["♠", "♣", "♥", "♦"]; //array of suits, values, and card values
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const CARD_VALUES = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() { //binds "this.cards.length" to "numberOfCards" so that will be called when the property is looked up
    return this.cards.length;
  }

  pop() {
    return this.cards.shift(); //takes first element of our array, takes it off and returns it to us
  }

  shuffle() { //shuffles the deck randomly; loops until each all 52 cards are randomized
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldIndex = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldIndex;
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    //determines the color of the card displayed
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  displayCard() {
    const cardDisplayed = document.createElement("div");
    cardDisplayed.innerText = this.suit;
    cardDisplayed.classList.add("card", this.color);
    cardDisplayed.dataset.value = `${this.value}`; //.dataset accesses the data-value in the card (for example 9, then takes the appropriate suit and displays it)
    return cardDisplayed;
  }
  //getHTML will essentially output the following
  // <div class="card red" data-value="9 ♥">
  // </div>
}

const computerCardSlot = document.querySelector(".computer-card-slot");
const playerCardSlot = document.querySelector(".player-card-slot");
const universalDeckElement = document.querySelector(".universal-deck");
const text = document.querySelector(".text");
const playerScoreSlot = document.querySelector(".player-score");
const computerScoreSlot = document.querySelector(".computer-score");

let universalDeck, inRound, stopGame, playerScore, computerScore;

document.addEventListener("click", () => {
  //if inRound = true, start cleanBeforeRound, else, flipCards.
  if (stopGame) {
    startGame();
    return;
  }

  if (inRound) {
    cleanBeforeRound();
  } else {
    flipCards();
  }
});

startGame();

//---functions------------------------------------------------------------------------------------------------

function freshDeck() { //Creates an Array with Suits and Values
  return SUITS.flatMap((suit) => { //combines all 4 seperate arrays into one array
    return VALUES.map((value) => { //makes 4 seperate arrays of suits (with values)
      return new Card(suit, value); //creates a card with a suit and value
    });
  });
}

function startGame() {
  const deck = new Deck(); //creates a new deck
  deck.shuffle(); //shuffles

  universalDeck = new Deck(deck.cards.slice(0, deck.numberOfCards)); //assigns it to universalDeck

  inRound = false;
  stopGame = false;
  playerScore = 0; //setting scores to 0; also plays part in reset
  computerScore = 0;
  playerScoreSlot.innerText = "0";
  computerScoreSlot.innerText = "0";

  cleanBeforeRound(); //sets the Slots and text to blank
}

function cleanBeforeRound() {
  inRound = false;
  computerCardSlot.innerHTML = "";
  playerCardSlot.innerHTML = "";
  text.innerHTML = "";

  updateDeckCount(); //updates the deck count number
}

function updateDeckCount() {
  universalDeckElement.innerText = universalDeck.numberOfCards;
}

function flipCards() { //flipping cards over
  inRound = true;

  const playerCard = universalDeck.pop(); //takes the top card from the universal deck
  const computerCard = universalDeck.pop(); //same

  playerCardSlot.appendChild(playerCard.displayCard()); //displays it in player slot
  computerCardSlot.appendChild(computerCard.displayCard()); // computer slot

  updateDeckCount();

  if (isRoundWinner(playerCard, computerCard)) { //Check for win condition for the round
    text.innerText = "Player Wins!";
    playerScore++;
    playerScoreSlot.innerText = `${playerScore}`;

  } else if (isRoundWinner(computerCard, playerCard)) {
    text.innerText = "Computer Wins!";
    computerScore++;
    computerScoreSlot.innerText = `${computerScore}`;

  } else {
    text.innerText = "DRAW!";
  }

  if (gameOver(universalDeck)) { //Game is over when deck === 0; compares the score
    if (playerScore > computerScore) {
      text.innerText =
        "PLAYER WINS! ...You survive another day...until Super-COVID gets you.";

    } else if (computerScore > playerScore) {
      text.innerText = "COMPUTER WINS! ...everyone is dead. ";

    } else {
      text.innerText = "DRAW! Justin is dead.";
    }
    stopGame = true;
  }
}

function isRoundWinner(currentPlayersCard, currentComputersCard) { //behind the scenes score comparison
  return CARD_VALUES[currentPlayersCard.value] > CARD_VALUES[currentComputersCard.value];
}

function gameOver(universalDeck) { //checks when the game ends.
  return universalDeck.numberOfCards === 0;
}
