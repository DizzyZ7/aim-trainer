const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");
const startBtn = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const endScreen = document.getElementById("end-screen");

let score = 0;
let timeLeft = 30;
let targetSize = 48;
let targetSpeed = 1000;
let timer;
let gameRunning = false;
let endlessMode = false;

let bestScore = localStorage.getItem("aim_best") || 0;
bestEl.textContent = bestScore;

// Telegram тёмная тема
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  if (Telegram.WebApp.colorScheme === "dark") document.body.classList.add("dark");
}

// 🔹 Выбор режима
document.querySelectorAll(".mode").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    endlessMode = btn.dataset.mode === "endless";

    // Показываем / скрываем блоки настроек
    document.getElementById("difficulty-block").style.display = endlessMode ? "none" : "block";
    document.getElementById("duration-block").style.display = endlessMode ? "none" : "block";

    // Когда выбираем бесконечный — ставим стартовые значения
    if (endlessMode) {
      targetSize = 48;
      targetSpeed = 1500;
      timerEl.textContent = "∞";
    } else {
      timerEl.textContent = timeLeft;
    }
  });
});

// 🔹 Сложность
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".difficulty").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    targetSize = +btn.dataset.size;
    targetSpeed = +btn.dataset.speed;
  });
});

// 🔹 Время
document.querySelectorAll(".duration").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".duration").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    timeLeft = +btn.dataset.time;
  });
});

startBtn.addEventListener("click", startGame);
document.getElementById("retry-btn").addEventListener("click", restartGame);

function restartGame() {
  endScreen.classList.add("hidden");
  menu.classList.remove("hidden");
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  timerEl.textContent = endlessMode ? "∞" : timeLeft;

  menu.classList.add("hidden");
  hud.classList.remove("hidden");
  gameArea.classList.remove("hidden");
  endScreen.classList.add("hidden");

  spawnTarget();
  if (!endlessMode) timer = setInterval(updateTimer, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  gameArea.innerHTML = "";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("aim_best", bestScore);
  }

  document.getElementById("final-score").textContent = score;
  document.getElementById("final-best").textContent = bestScore;
  hud.classList.add("hidden");
  gameArea.classList.add("hidden");
  endScreen.classList.remove("hidden");
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

    // ускорение бесконечного режима
    if (endlessMode) {
      targetSpeed = Math.max(250, +(targetSpeed - 10).toFixed(2));
    }

    spawnTarget();
  };

  gameArea.appendChild(target);

  setTimeout(() => {
    if (target.parentNode) {
      target.remove();
      if (endlessMode) endGame(); // промах — конец
      else spawnTarget();
    }
  }, targetSpeed);
}
