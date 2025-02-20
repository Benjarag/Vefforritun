/* Section 1: Convert to arrow functions*/
function testArrowFunctions() {
  function multiply(a, b) {
    return a * b;
  }
  console.log(multiply(4, 5));
}

/* Section 2: Use built-in array methods instead of loops*/
const testArrayMethods = () => {
  const numbers = [1, 2, 3, 4, 5];
  const doubled = [];
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2);
  }
  console.log(doubled);
};

/*Section 3: Fetch data from an API*/
const fetchUserData = () => {
  const url = "https://jsonplaceholder.typicode.com/users";
  const userList = document.getElementById("user-list");
};

/*Section 4: Memory card mathing game*/
const emojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍒",
  "🍍",
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍒",
  "🍍",
];
let shuffledEmojis = emojis.sort(() => 0.5 - Math.random());
let selectedCards = [];
let matchedPairs = 0;
const gameBoard = document.getElementById("game-board");

const createBoard = () => {
  gameBoard.innerHTML = "";
  shuffledEmojis.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = "❓";
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
};

const resetGame = () => {
  shuffledEmojis = emojis.sort(() => 0.5 - Math.random());
  matchedPairs = 0;
  selectedCards = [];
  createBoard();
};

const flipCard = (event) => {
  const card = event.target;
};

const checkMatch = () => {
  const [card1, card2] = selectedCards;
};

createBoard();

document.addEventListener("DOMContentLoaded", createBoard);
