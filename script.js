const canvas = document.getElementById("canvasPlay");
const ctx = canvas.getContext("2d");

const restartBtn = document.getElementById("restartBtn");

let direction;
let box = 10;
let score;
let highScore = 0;
let snake;
let food;
let game;
let isGameOver = false;
let pulse = 0;

// ================= START GAME =================
function startGame() {
  direction = "RIGHT";
  score = 0;
  snake = [{ x: 40, y: 60 }];
  food = randomFood();
  isGameOver = false;

  clearInterval(game);
  game = setInterval(loopSnake, 100);

  restartBtn.disabled = true;
}

// ================= RANDOM FOOD =================
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// ================= GAME LOOP =================
function loopSnake() {
  if (isGameOver) return;

  // background
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  let head = snake[0];
  let newHead = { x: head.x, y: head.y };

  // movement
  if (direction === "RIGHT") newHead.x += box;
  else if (direction === "LEFT") newHead.x -= box;
  else if (direction === "UP") newHead.y -= box;
  else if (direction === "DOWN") newHead.y += box;

  // wall collision
  if (
    newHead.x < 0 ||
    newHead.y < 0 ||
    newHead.x >= canvas.width ||
    newHead.y >= canvas.height
  ) {
    gameOver();
    return;
  }

  // self collision
  for (let i = 0; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  snake.unshift(newHead);

  // food collision
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    food = randomFood();
  } else {
    snake.pop();
  }

  pulse += 0.2;

  drawFood();
  drawSnake();
  drawScore();
}

// ================= DRAW FUNCTIONS =================

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#1abc9c" : "#16a085";
    roundRect(segment.x, segment.y, box, box, 3);
    ctx.fill();
  });
}

function drawFood() {
  let size = box + Math.sin(pulse) * 2;

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(
    food.x + box / 2,
    food.y + box / 2,
    size / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawScore() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(5, 5, 120, 40);

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";

  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High: " + highScore, 10, 35);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 1;

  for (let i = 0; i < canvas.width; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < canvas.height; i += box) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

// ================= GAME OVER =================

function gameOver() {
  clearInterval(game);
  isGameOver = true;

  if (score > highScore) {
    highScore = score;
  }

  restartBtn.disabled = false;

  drawGameOver();
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 60, 200, 120);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "22px Arial";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);

  ctx.font = "12px Arial";
  ctx.fillText(
    "Click Restart",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

// ================= HELPERS =================

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ================= CONTROLS =================

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// ================= BUTTON =================

restartBtn.addEventListener("click", () => {
  startGame();
});

// ================= INIT =================
startGame();