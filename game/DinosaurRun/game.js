const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

let dino = { x: 50, y: 150, width: 50, height: 50, jumping: false, velocity: 0, gravity: 1 };
let obstacle = { x: canvas.width, y: 150, width: 30, height: 50, speed: 5 };
let score = 0;
let gameOver = false;

function drawDino() { ctx.fillRect(dino.x, dino.y, dino.width, dino.height); }
function drawObstacle() { ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); }
function drawScore() { ctx.font = "20px Arial"; ctx.fillStyle = "black"; ctx.fillText("Score: " + Math.floor(score), 10, 30); }
function checkCollision() { return dino.x < obstacle.x + obstacle.width && dino.x + dino.width > obstacle.x && dino.y < obstacle.y + obstacle.height && dino.y + dino.height > obstacle.y; }

function jump() { if (!dino.jumping) { dino.jumping = true; dino.velocity = -15; } }

function resetGame() {
    dino = { x: 50, y: 150, width: 50, height: 50, jumping: false, velocity: 0, gravity: 1 };
    obstacle = { x: canvas.width, y: 150, width: 30, height: 50, speed: 5 };
    score = 0;
    gameOver = false;
    restartButton.style.display = "none";
    update();
}

document.addEventListener("keydown", (event) => { if (event.code === "Space") { jump(); } });
restartButton.addEventListener("click", resetGame);

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (dino.jumping) { dino.y += dino.velocity; dino.velocity += dino.gravity; if (dino.y >= 150) { dino.y = 150; dino.jumping = false; } }
    obstacle.x -= obstacle.speed;
    if (obstacle.x + obstacle.width <= 0) { obstacle.x = canvas.width; }

    drawDino();
    drawObstacle();
    drawScore();

    if (checkCollision()) {
        gameOver = true;
        restartButton.style.display = "block";
        alert("게임 오버! 최종 점수는 " + Math.floor(score) + "입니다.");
    } else {
        score += 0.1;
        requestAnimationFrame(update);
    }
}

update();
