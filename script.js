const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");
const startBtn = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");

let score = 0;
let timeLeft = 30;
let targetSize = 48;
let timer;
let gameRunning = false;

let bestScore = localStorage.getItem("aim_best") || 0;
bestEl.textContent = bestScore;

if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  if (Telegram.WebApp.colorScheme === "dark") {
    document.body.classList.add("dark");
  }
}

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".difficulty").forEach(b => b.style.opacity = 0.5);
    btn.style.opacity = 1;
    targetSize = parseInt(btn.dataset.size);
  });
});

document.querySelectorAll(".duration").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".duration").forEach(b => b.style.opacity = 0.5);
    btn.style.opacity = 1;
    timeLeft = parseInt(btn.dataset.time);
  });
});

startBtn.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  menu.classList.add("hidden");
  hud.classList.remove("hidden");
  gameArea.classList.remove("hidden");

  spawnTarget();
  timer = setInterval(updateTimer, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  gameArea.innerHTML = "";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("aim_best", bestScore);
    bestEl.textContent = bestScore;
  }

  alert(`⏱ Время вышло!\nСчёт: ${score}\nРекорд: ${bestScore}`);

  menu.classList.remove("hidden");
  hud.classList.add("hidden");
  gameArea.classList.add("hidden");
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
  target.style.width = `${targetSize}px`;
  target.style.height = `${targetSize}px`;

  const x = Math.random() * (gameArea.clientWidth - targetSize);
  const y = Math.random() * (gameArea.clientHeight - targetSize);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.onclick = () => {
    score++;
    scoreEl.textContent = score;
    target.remove();
    spawnTarget();
  };

  gameArea.appendChild(target);

  setTimeout(() => {
    if (target.parentNode) {
      target.remove();
      spawnTarget();
    }
  }, 1500);
}
