let start = document.querySelector('.start_game')
let gameCount = document.querySelector('.game_count')
let bestGameCount = document.querySelector('.best_game_count')

let cellSize = 20;
let rows;
let columns;
let gameField;
let context;
let tail = [];
let tailParts = 1;
let snakeSpeedX = 1;
let snakeSpeedY = 0;
let count = 0;

start.addEventListener ('click', () => {
    loadScoreFromLocalStorrage();
    createGameField();
    startGame();
})

function saveScoreToLocalStorrage () {
    localStorage.setItem('best_count', `Лучший результат: ${count}`);
}

function loadScoreFromLocalStorrage () {
    bestGameCount.innerHTML = localStorage.getItem('best_count')
}

function getRandom(min, max) {
    return Math.floor(Math.random()*(max - min)) + min;
}

function createGameField() {
    rows = prompt('число строк');
    columns = prompt('число столбцов');
    gameField = document.getElementById('gameField')
    gameField.height = cellSize*rows;
    gameField.width = cellSize*columns;

    context = gameField.getContext("2d");
    context.fillStyle = 'green';
    context.fillRect(0, 0, gameField.width, gameField.height)
    setApple();
    setSnake();
}

function setApple() {
    appleX = getRandom(0, columns) * cellSize;
    appleY = getRandom(0, rows) * cellSize;
    context.fillStyle = 'red';
    context.fillRect(appleX, appleY, cellSize*2/3, cellSize*2/3);
}

function setSnake () {
    snakeX = Math.floor(columns/2) * cellSize;
    snakeY = Math.floor(rows/2) * cellSize;
    context.fillStyle = 'brown';
    context.fillRect(snakeX, snakeY, cellSize - 1, cellSize - 1);
}

function startGame() {
    let game = setInterval(() => {
        if (tail.length > tailParts) {
            context.fillStyle = 'green';
            context.fillRect(tail[tail.length-1].x, tail[tail.length-1].y, cellSize, cellSize)        
            tail.pop();
        }
        
        tail.unshift({x: snakeX, y: snakeY});
        snakeX += snakeSpeedX * cellSize;
        snakeY += snakeSpeedY * cellSize;
        
        if (snakeX >= gameField.width) {
            snakeX = 0;
        } else if (snakeX < 0) {
            snakeX = gameField.width - cellSize
        } else if (snakeY >= gameField.height) {
            snakeY = 0;
        } else if (snakeY < 0) {
            snakeY = gameField.height - cellSize
        }

        if (snakeX === appleX && snakeY === appleY) {
            tailParts++;
            count++;
            gameCount.textContent = `Счет: ${count}`;
            setApple();
        }

        context.fillStyle = 'brown';
        context.fillRect(snakeX, snakeY, cellSize - 1, cellSize - 1);

        context.fillStyle = 'grey';
        context.fillRect(tail[0].x, tail[0].y, cellSize - 1, cellSize - 1);

        tail.forEach((elem) => {
            if (snakeX === elem.x && snakeY === elem.y) {
                console.log('stop');
                clearInterval(game);
                if (count > bestGameCount.value) {
                    saveScoreToLocalStorrage();
                }
                tailParts = 1;
                count = 0;
                gameCount.textContent = `Счет: ${count}`;
            } 
        });

        document.addEventListener('keydown', function(event) {
            if (event.code == 'ArrowUp' && snakeSpeedY === 0) {
                snakeSpeedX = 0;
                snakeSpeedY = -1;
            } else if (event.code == 'ArrowDown' && snakeSpeedY === 0) {
                snakeSpeedX = 0;
                snakeSpeedY = 1;
            } else if (event.code == 'ArrowLeft' && snakeSpeedX === 0) {
                snakeSpeedX = -1;
                snakeSpeedY = 0;
            } else if (event.code == 'ArrowRight' && snakeSpeedX === 0) {
                snakeSpeedX = 1;
                snakeSpeedY = 0;
            }
        })
    }, 500);
}