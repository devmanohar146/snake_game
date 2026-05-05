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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  drawFood();
  drawSnake();
  drawScore();
}

// ================= DRAW FUNCTIONS =================

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // head
      ctx.fillStyle = "#2c3e50";
    } else {
      ctx.fillStyle = "#8e44ad";
    }
    ctx.fillRect(segment.x, segment.y, box, box);
  });
}

function drawFood() {
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(food.x, food.y, box, box);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High: " + highScore, 10, 40);
}

function drawGrid() {
  ctx.strokeStyle = "#eee";
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
  // overlay
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "28px Arial";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);

  ctx.font = "14px Arial";
  ctx.fillText(
    "Click Restart to play again",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
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