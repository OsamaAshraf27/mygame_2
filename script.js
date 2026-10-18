const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

let gameInterval;
let gameStarted = false;

document.addEventListener("keydown", changeDirection);

function gameLoop() {
    if (hasGameEnded()) {
        alert(`جيم أوفر يا أسامة! 💀\nنقاطك: ${score}`);
        resetGame();
        return;
    }

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = "#161b22";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        // رأس الثعبان بلون مختلف
        ctx.fillStyle = index === 0 ? "#00ff88" : "#00cc66";
        ctx.shadowBlur = index === 0 ? 10 : 0;
        ctx.shadowColor = "#00ff88";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0; // إعادة ضبط التوهج
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // إذا أكل الثعبان الطعام
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }
        generateFood();
    } else {
        snake.pop(); // حذف الذيل إذا لم يأكل
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // التأكد من عدم ظهور الاكل على جسم الثعبان
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "#ff0055";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0055";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(gameLoop, 100); // سرعة اللعبة
    }

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT && !goingRight) { dx = -1; dy = 0; }
    if (keyPressed === UP && !goingDown) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT && !goingLeft) { dx = 1; dy = 0; }
    if (keyPressed === DOWN && !goingUp) { dx = 0; dy = 1; }
}

function hasGameEnded() {
    // الاصطدام بالجدران
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= tileCount;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= tileCount;

    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) return true;

    // الاصطدام بالجسم
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }

    return false;
}

function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.innerText = score;
    gameStarted = false;
    clearCanvas();
    drawSnake();
    drawFood();
}

// رسم المكونات الأولية قبل بدء الحركة
drawSnake();
drawFood();