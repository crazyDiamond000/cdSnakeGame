var canvas, ctx, appleX, appleY, myInterval, currentDirection;
var boardSize = 450;
var boxSize = 30;
var boxNum = 15;
var snakeX = 7;
var snakeY = 7;
var velocityX = 0;
var velocityY = 0;
var gameOver = false;
var score = 0;

var snakeBody = [];

window.onload = function() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    drawGrid();
    placeApple();
    drawScore();
    document.addEventListener("keyup", changeDirection);
    
    myInterval = setInterval(update, 125); //125ms or 8 times a second
}

function drawGrid() {
    ctx.fillStyle = "darkslategray";
    ctx.fillRect(0, 0, boardSize, boardSize);
    //15x15
    ctx.fillStyle = "lightgreen";
    for (let x = 1; x < boardSize; x += boxSize) {
        for (let y = 1; y < boardSize; y += boxSize) {
            ctx.fillRect(x, y, boxSize - 2, boxSize - 2);
        }
    }
}

function drawScore() {
    let text = "Score: " + score;
    document.getElementById("score").innerHTML = text;
}

function update() {
    if (gameOver) {
        clearInterval(myInterval);
        gameLost();
    } else {

        if (currentDirection == 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (currentDirection == 2) {
            velocityX = 0;
            velocityY = 1;
        } else if (currentDirection == 3) {
            velocityX = -1;
            velocityY = 0;
        } else if (currentDirection == 4) {
            velocityX = 1;
            velocityY = 0;
        }

        drawGrid();
        drawApple();
        moveSnake();
        drawSnake();

        if (snakeX == appleX && snakeY == appleY) {
            snakeBody.unshift([appleX, appleY]);
            placeApple();
            drawApple(); //so apple shows up immediately, instead of after the board updates
            score++;
            drawScore();
        }
    }

    //game over
    if (snakeX < 0 || snakeY < 0 || snakeX > boxNum -1 || snakeY > boxNum - 1) {
        gameOver = true;
    }
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * boxSize, appleY * boxSize, boxSize, boxSize);
}

function placeApple() {
    appleX = random(0, 15);
    appleY = random(0, 15);
    for (let i = 1; i < snakeBody.length; i++) {
        if (appleX == snakeBody[i][0] && appleY == snakeBody[i][1]) {
            placeApple();
        }
    }
}

function drawSnake() {
    ctx.fillStyle = "blue";
    ctx.fillRect(snakeX * boxSize, snakeY * boxSize, boxSize, boxSize);

    for (let i = 0; i < snakeBody.length; i++) {
        ctx.fillRect(snakeBody[i][0] * boxSize, snakeBody[i][1] * boxSize, boxSize, boxSize);
    }
}

function moveSnake() {
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX;
    snakeY += velocityY;
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        currentDirection = 1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        currentDirection = 2;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        currentDirection = 3;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        currentDirection = 4;
    }
}

function gameLost() {
    var halfBoard = boardSize / 2;
    ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
    ctx.fillRect(halfBoard - 150, halfBoard - 80, 300, 160);
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", halfBoard, halfBoard - 30);
    ctx.font = "25px Arial";
    ctx.fillText("Press Enter to Restart", halfBoard, halfBoard + 35);
    document.addEventListener("keyup", restartGame);
}

function restartGame(e) {
    if (e.code == "Enter" && gameOver == true) {
        snakeX = 7;
        snakeY = 7;
        snakeBody = [];
        velocityX = 0;
        velocityY = 0;
        gameOver = false;
        currentDirection = null;
        drawGrid();
        placeApple();
        drawApple();
        myInterval = setInterval(update, 125);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }