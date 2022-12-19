// Get Elements
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const gameOverElement = document.querySelector(".game-over");
const playAgainElement = document.querySelector(".play-again");
const startContainerELement = document.querySelector(".start-container");

// Select Canvas
let snakeTable = document.getElementById("snake-table");
let canvasContext = snakeTable.getContext("2d");

//Game Variables
let gameLoop;
const squareSize = 36;
const horizontalSquare = 17;
const verticalSquare = 15;

// Colors
const borderSquareColor = "#aad751";
const evenSquareColor = "#aad751";
const oddSquareColor = "#a2d149";

//Game Start
let gameStarted = false;

//Direction
let currentDirection = '';
let directionsQueue = [];
const direction = {
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown'
}

// Audio
let snakeEatingFoodAudio = new Audio('./audio/snakeEatingFoodAudio.mp3');
let snakeDeadAudio = new Audio('./audio/snakeDeadAudio.mp3');

// Create Snake
let snake = [
    { x: 2, y: 0 },//Head
    { x: 1, y: 0 },//Body
    { x: 0, y: 0 }//Tail
];

// Snake Food
let food = createFood();

//Score Variables
const initialSnakeLength = snake.length;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

// Events
document.addEventListener('keyup', setDirection);
playAgainElement.addEventListener("click", playAgain);

function mainLogic() {
    drawSnakeTable();
    drawSnake();
    drawFood();
    moveSnake();
    renderScore();
    if (hitWall() || hitSelf()) {
        clearInterval(gameLoop);
        snakeDeadAudio.play();
        gameOver();
    }
}
mainLogic();

function drawSnakeTable() {
    for (let x = 0; x < horizontalSquare; x++) {
        for (let y = 0; y < verticalSquare; y++) {
            if (x % 2 === y % 2) {
                canvasContext.fillStyle = evenSquareColor;
                canvasContext.fillRect(squareSize * x, squareSize * y, squareSize, squareSize);
            } else {
                canvasContext.fillStyle = oddSquareColor;
                canvasContext.fillRect(squareSize * x, squareSize * y, squareSize, squareSize);
            }
        }
    }
}

function drawSnake() {
    const snakeHeaderColor = "#ffff00";
    const snakeBodyColor = "#ffff99";
    snake.forEach((square, index) => {
        if (index === 0) {
            drawSquare(square.x, square.y, snakeHeaderColor);
        } else {
            drawSquare(square.x, square.y, snakeBodyColor);
        }
    })
}

function drawFood() {
    const foodColor = "#ff3300";
    drawSquare(food.x, food.y, foodColor);
}

function moveSnake() {
    if (!gameStarted) return;
    //Get Head Position using spread operator or you can change width const head = { x: snake[0].x, y: snake[0].y };
    const head = { ...snake[0] };
    //consume direction
    if (directionsQueue.length) {
        currentDirection = directionsQueue.shift();
    }
    switch (currentDirection) {
        case direction.RIGHT:
            head.x += 1;
            break;
        case direction.LEFT:
            head.x -= 1;
            break;
        case direction.UP:
            head.y -= 1;
            break;
        case direction.DOWN:
            head.y += 1;
            break;
    }
    if (hasEatenFood()) {
        snakeEatingFoodAudio.play();
        food = createFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

function renderScore() {
    score = snake.length - initialSnakeLength;
    scoreElement.innerHTML = "Your score: " + score;
    highScoreElement.innerHTML = "High score: " + highScore;
}

function hitWall() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= horizontalSquare || head.y < 0 || head.y >= verticalSquare
    )
}

function hitSelf() {
    const snakeBody = [...snake];
    const head = snakeBody.shift();
    return snakeBody.some(function (square) {
        if (square.x === head.x && square.y === head.y) {
            return true;
        } else {
            return false;
        }
    });
}

function drawSquare(x, y, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    canvasContext.strokeStyle = borderSquareColor;
    canvasContext.strokeRect(squareSize * x, squareSize * y, squareSize, squareSize);
}

function hasEatenFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function setDirection(event) {
    startContainerELement.classList.add("hide");
    const newDirection = event.key;
    const oldDirection = currentDirection;
    if (
        newDirection === direction.LEFT && oldDirection !== direction.RIGHT ||
        newDirection === direction.RIGHT && oldDirection !== direction.LEFT ||
        newDirection === direction.UP && oldDirection !== direction.DOWN ||
        newDirection === direction.DOWN && oldDirection !== direction.UP
    ) {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop = setInterval(mainLogic, 1000 / 7);
        }
        directionsQueue.push(newDirection);
    }
}

function createFood() {
    let food = {
        x: Math.floor(Math.random() * (horizontalSquare)),
        y: Math.floor(Math.random() * (verticalSquare)),
    };
    while (snake.some(function (square) {
        if (square.x === food.x && square.y === food.y) {
            food = {
                x: Math.floor(Math.random() * (horizontalSquare)),
                y: Math.floor(Math.random() * (verticalSquare)),
            };
        }
    }));
    return food;
}

function gameOver() {
    let gameOverScoreElement = document.querySelector(".game-over-score .current");
    let gameOverHighScoreElement = document.querySelector(".game-over-score .high");

    highScore = Math.max(score, highScore);
    localStorage.setItem("high-score", highScore);
    gameOverScoreElement.innerHTML = "Your score: " + score;
    gameOverHighScoreElement.innerHTML = "High score: " + highScore;
    gameOverElement.classList.remove("hide");
}

function playAgain() {
    startContainerELement.classList.remove("hide");
    snake = [
        { x: 2, y: 0 },//Head
        { x: 1, y: 0 },//Body
        { x: 0, y: 0 }//Tail
    ];
    currentDirection = "";
    directionsQueue = [];
    gameOverElement.classList.add("hide");
    gameStarted = false;
    mainLogic();
}
