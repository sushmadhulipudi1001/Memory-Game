const emojis = ['🍕', '🎃', '🐱', '🧠', '🌈', '🚀', '🎲', '🍩'];
let cards = [...emojis, ...emojis];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let moves = 0;
let playerName = "";

const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const winMessage = document.getElementById("win-message");
const leaderboard = document.getElementById("leaderboard");
const statsDiv = document.getElementById("stats");

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  board.innerHTML = "";
  matchedCount = 0;
  moves = 0;
  movesDisplay.textContent = moves;
  winMessage.classList.add("hidden");
  cards = shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this.classList.contains("revealed") || this.classList.contains("matched")) return;

  this.classList.add("revealed");
  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;
  lockBoard = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCount += 2;
    resetFlip();
    if (matchedCount === cards.length) {
      winMessage.classList.remove("hidden");
      saveScore(playerName, moves);
      showLeaderboard();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetFlip();
    }, 1000);
  }
}

function resetFlip() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartGame() {
  createBoard();
}

function startGame() {
  const input = document.getElementById("player-name");
  if (!input.value.trim()) {
    alert("Please enter your name to start.");
    return;
  }
  playerName = input.value.trim();
  statsDiv.classList.remove("hidden");
  createBoard();
  showLeaderboard();
}

//Leaderboard Functions
function saveScore(name, moves) {
  let scores = JSON.parse(localStorage.getItem("memoryGameScores")) || [];
  scores.push({ name, moves });
  scores.sort((a, b) => a.moves - b.moves);
  scores = scores.slice(0, 5); // Keep top 5
  localStorage.setItem("memoryGameScores", JSON.stringify(scores));
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("memoryGameScores")) || [];
  leaderboard.innerHTML = "";
  scores.forEach((entry, index) => {
    const li = document.createElement("li");
   li.textContent = `${entry.name} - ${entry.moves} moves`;

    leaderboard.appendChild(li);
  });
}

//Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
