const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timeLeft = 30;
let timer;
let gameRunning = false;

// Загружаем лучший результат
let bestScore = localStorage.getItem("aim_best") || 0;
bestEl.textContent = bestScore;

// Адаптация к Telegram теме
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  const theme = Telegram.WebApp.colorScheme;
  if (theme === "dark") document.body.classList.add("dark");
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  startBtn.style.display = "none";
  spawnTarget();
  timer = setInterval(updateTimer, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  gameArea.innerHTML = "";
  startBtn.style.display = "inline-block";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("aim_best", bestScore);
    bestEl.textContent = bestScore;
  }

  alert(`⏱ Время вышло!\nСчёт: ${score}\nРекорд: ${bestScore}`);
}

function updateTimer() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function spawnTarget() {
  if (!gameRunning) return;

  const target = document.createElement("div");
  target.classList.add("target");

  const size = 48;
  const areaRect = gameArea.getBoundingClientRect();

  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.onclick = () => {
    score++;
    scoreEl.textContent = score;
    target.remove();
    spawnTarget();
  };

  gameArea.appendChild(target);

  // Удаляем через 1.5 сек, если не кликнули
  setTimeout(() => {
    if (target.parentNode) {
      target.remove();
      spawnTarget();
    }
  }, 1500);
}

startBtn.addEventListener("click", startGame);
