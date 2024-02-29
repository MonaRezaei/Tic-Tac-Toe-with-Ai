const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
const modal = document.querySelector(".modal");
const imgResult = modal.querySelector('img');
const xResult = document.querySelector('.x');
const oResult = document.querySelector('.o');


canvas.addEventListener('click', clickPlayer);


let board = [];
const row = 3;
const column = 3;
const spaceSize = 150;
let player;
let humanPlayer = "X";
let aiPlayer = "O";
const xImage = new Image();
xImage.src = "assets/img/X.png";

const oImage = new Image();
oImage.src = "assets/img/O.png";

let gameData = new Array(9);
let currentPlayer = humanPlayer;
let gameOver = false;



const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

drawBoard();

function drawBoard() {
    let id = 0;
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i][j] = id;
            id++;
            ctx.strokeStyle = "#505858";
            ctx.strokeRect(j * spaceSize, i * spaceSize, spaceSize, spaceSize)
        }
    }
}

function clickPlayer(e) {

    if (gameOver) return;

    let X = e.clientX - canvas.getBoundingClientRect().x;
    let Y = e.clientY - canvas.getBoundingClientRect().y;

    let i = Math.floor(Y / spaceSize);
    let j = Math.floor(X / spaceSize);

    let id = board[i][j];
    if (gameData[id]) return;

    gameData[id] = currentPlayer;

    drawOnBoard(currentPlayer, i, j);

    if (isWinner(gameData, currentPlayer)) {
        showGameOver(currentPlayer);
        gameOver = true;
        return;
    }

    if (isTie(gameData)) {
        showGameOver("tie");
        gameOver = true;
        return;
    } else {
        currentPlayer = currentPlayer == aiPlayer ? humanPlayer : humanPlayer;
    }

    if (aiPlayer == "O") {

        let id = minimax(gameData, aiPlayer).id;

        gameData[id] = aiPlayer;

        let space = getIJ(id);

        drawOnBoard(aiPlayer, space.i, space.j);

        if (isWinner(gameData, aiPlayer)) {
            showGameOver(aiPlayer);
            gameOver = true;
            return;
        }

        if (isTie(gameData)) {
            showGameOver("tie");
            gameOver = true;
            return;
        }

    } else {

        currentPlayer = currentPlayer == aiPlayer ? humanPlayer : humanPlayer;
    }
}


function minimax(gameData, PLAYER) {

    if (isWinner(gameData, aiPlayer))    return { evaluation: +10 };
    if (isWinner(gameData, humanPlayer)) return { evaluation: -10 };
    if (isTie(gameData))                 return { evaluation: 0 };

    let emptySpaces = getEmptySpaces(gameData);
    let moves = [];

    for (let i = 0; i < emptySpaces.length; i++) {

        let id = emptySpaces[i];
        let backup = gameData[id];

        gameData[id] = PLAYER;
        let move = {};
        move.id = id;

        if (PLAYER == aiPlayer) {
            move.evaluation = minimax(gameData, humanPlayer).evaluation;
        } else {
            move.evaluation = minimax(gameData, aiPlayer).evaluation;
        }

        gameData[id] = backup;
        moves.push(move);
    }

    let bestMove;

    if (PLAYER == aiPlayer) {
        let bestEvaluation = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].evaluation > bestEvaluation) {
                bestEvaluation = moves[i].evaluation;
                bestMove = moves[i];
            }
        }
    } else {
        let bestEvaluation = +Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].evaluation < bestEvaluation) {
                bestEvaluation = moves[i].evaluation;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

function getEmptySpaces(gameData) {
    let empty = [];

    for (let id = 0; id < gameData.length; id++) {
        if (!gameData[id]) empty.push(id);
    }

    return empty;
}

function getIJ(id) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == id) return { i: i, j: j }
        }
    }
}

function isWinner(gameData, player) {
    for (let i = 0; i < winCombos.length; i++) {
        let won = true;

        for (let j = 0; j < winCombos[i].length; j++) {
            let id = winCombos[i][j];
            won = gameData[id] == player && won;
        }

        if (won) {
            return true;
        }
    }
    return false;
}

function isTie(gameData) {
    let isBoardFill = true;
    for (let i = 0; i < gameData.length; i++) {
        isBoardFill = gameData[i] && isBoardFill;
    }
    if (isBoardFill) {
        return true;
    }
    return false;
}
function showGameOver(player) {

    if (currentPlayer = player == "X") {

        imgResult.src = "assets/img/win.png";
        xResult.innerHTML = `X : Win`;
      
    } else if (currentPlayer = player == "O") {

        imgResult.src = "assets/img/lose.png";
        oResult.innerHTML = `O : Win`;

    } else if (currentPlayer = player == "tie") {

        imgResult.src = "assets/img/tie.png";

    }

    modal.style.transform = 'scale(1)';

}

function drawOnBoard(player, i, j) {
    let img = player == "X" ? xImage : oImage;
    ctx.drawImage(img, j * spaceSize, i * spaceSize);
}

function playAgain() {
    modal.style.transform = 'scale(0)';
    location.reload();
}
