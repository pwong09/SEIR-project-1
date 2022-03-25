/*----constant----*/
const bomb = 1;
const safe = 0;
const colors = {
    1: '#790AF0',
    2: '#0A30F0',
    3: '#229C10',
    4: '#A38A00',
    5: '#F09C0A',
    6: '#F0300A',
    7: '#4A1605',
    8: '#000000'
};

/*----state variables----*/
let win;
let lose;
let board;
let flags;
let boardSize;
let rows;
let cols;
let maxBombs;
let squareEls;

/*----cached elements----*/
const boardEl = document.querySelector('.board');
const boardSizeEl = document.querySelector('.board-sizes')
const replayBtn = document.querySelector('.replay');
const msgEl = document.querySelector('.msg');
const msgTextEl = document.querySelector('.msg > p')

/*----Event Listeners----*/
boardSizeEl.addEventListener('click', changeBoardSize)
boardEl.addEventListener('contextmenu', handleRightClick);
boardEl.addEventListener('click', handleLeftClick);
boardEl.addEventListener('touchstart',touchstart);
boardEl.addEventListener('touchend',touchend);
replayBtn.addEventListener('click', init);

/*----game play functions----*/
//choose a level of difficulty
function changeBoardSize(e){
    if (e.target.tagName === 'DIV') return
    if (e.target.tagName === 'BUTTON') {
        boardEl.style.display = 'grid';
        if (e.target.innerText === 'Easy') {
            rows = 8;
            cols = 8;
        } else if (e.target.innerText === 'Medium') {
            rows = 10;
            cols = 10;
        } else if (e.target.innerText === 'Hard') {
            rows = 18;
            cols = 18;
        }
    }
makeBoard();
init();
}
//restarts main game variables for same level of difficulty
function init(){
    squareEls.forEach(sq => {
        sq.innerText = '';
        sq.id = 'hidden'
        sq.disabled = false;
    });
    msgEl.style.display = 'none';
    win = false;
    lose = false;
    flags = 0;
    maxBombs = placeBombs();
    boardEl.addEventListener('click', handleLeftClick);
    render();
}
//renders lose / win message and shows where all bombs were located
function render(){
    if (lose) {
        msgTextEl.innerText = 'Game Over';
        }
    if (win) {
        msgEl.style.color = 'orange';
        msgTextEl.innerText = 'Winner, winner, chicken dinner!';
    }
    if (lose || win) {
        boardEl.removeEventListener('click', handleLeftClick);
        squareEls.forEach(sq => {
            let x = parseInt(sq.getAttribute('data-x'));
            let y = parseInt(sq.getAttribute('data-y'));
            if (board[x][y] === bomb) {
                sq.id = 'bomb';
                sq.innerText = '💣';
            }
        });
        setTimeout(() => {showMessage();}, 1000);
    }
}
//left click or touch to reveal either safe squares or bomb
function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    let x = parseInt(sq.getAttribute('data-x'));
    let y = parseInt(sq.getAttribute('data-y'));
    if (board[x][y] === bomb) {
        sq.id = 'bomb';
        lose = true;
    } else {
        checkNeighbors(x, y);
    }
checkWinner();
render();
}
//right click to place or remove flags and makes flagged square unclickable
function handleRightClick(e){
    e.preventDefault();
    let sq = e.target;
    let x = sq.getAttribute('data-x');
    let y = sq.getAttribute('data-y');
    if (sq.tagName === 'SECTION') return;
    if (sq.id === 'safe') return;
    if (sq.id === 'hidden'){
        sq.id = "flag";
        sq.disabled = true;
    } else {
        sq.id = 'hidden';
        sq.disabled = false;
        flags--;
    }
    if (sq.id === 'flag' && board[x][y] === bomb) flags++;
checkWinner();
render();
}

/*----helper functions----*/
//checks for winning logic
function checkWinner(){
    let count = 0;
    squareEls.forEach(sq => {
        if (sq.id === 'safe') count++;
        if (flags === maxBombs) win = true;
    });
    if (count === (boardSize - maxBombs)) win = true;
}
//displays overlapping div with win / lose message
function showMessage(){
    let width = boardEl.clientWidth;
    msgEl.style.display = 'block';
    msgEl.style.width = `${width}px`;
    msgEl.style.height = `${width}px`;
    replayBtn.style.display = 'revert';
}
//make board, all squares start as safe
function makeBoard(){
    board = [];
    for (let i = 0; i < rows; i++){
        board[i] = [];
    }
    board.forEach(row => {
        for (let i = 0; i < rows; i++){
            row.push(safe);
        }
    });
//make the board grid based on level of difficulty
    boardSize = rows * cols;
    boardEl.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    boardEl.style.gridTemplateRows =  `repeat(${cols}, 1fr)`;
/*---make the board's squares and coordinates when selecting or changing difficulty level---*/
    if (boardEl.childElementCount === 0 || boardEl.childElementCount !== boardSize) {
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.firstChild);
    }
    let x = 0;
    let y = 0;
    for (let i = 0; i < boardSize; i++) {
        let width = boardEl.clientWidth;
        let sqWidth = width / rows;
        const squareEl = document.createElement('button');
        squareEl.className = "square";
        squareEl.id = "hidden";
        squareEl.setAttribute('data-x', `${x}`);
        squareEl.setAttribute('data-y', `${y}`);
        squareEl.style.width = `${sqWidth}px`;
        squareEl.style.height = `${sqWidth}px`;
        boardEl.appendChild(squareEl);
        if (y < (rows - 1)) {
            y++;
        } else {
            y = 0;
            x++;
        }
    }
    squareEls = document.querySelectorAll('.square');
}
}
//randomly places bombs onto the board
function placeBombs(){
    let numOfBombs = 0;
    for(let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = safe;
        }
    }
    if (rows < 10) {
        for (let i = 0; i < (rows); i++) {
            let x = randomIndex()
            let y = randomIndex()
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
            }
        }
    } else {
//more bombs for Medium and Hard levels
        for (let i = 0; i < (rows*2); i++) {
            let x = randomIndex()
            let y = randomIndex()
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
            }
        }
    }
    placeNumbers();
    return numOfBombs;
}
//displays correct number of adjacent bombs on safe squares to give player the right clues
function placeNumbers(){
    for (let i = 0; i < boardSize; i++) {
        let bombCount = 0;
        let sq = squareEls[i];
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        let leftSide = i % rows === 0;
        let rightSide = i % rows === .875;
        let lastRow = rows - 1;
        let left = y - 1;
        let right = y + 1;
        let up = x - 1;
        let down = x + 1;
        if (board[x][y] === safe) {
            //bomb on the left
            if (board[x][left] === bomb && !leftSide) bombCount++;
            //bomb on the right
            if (!rightSide && board[x][right] === bomb) bombCount++;
            //bomb above
            if (x > 0 && board[up][y] === bomb) bombCount++;
            //bomb below
            if (x < lastRow && board[down][y] === bomb) bombCount++;
            //bomb upper left corner
            if (!rightSide && x > 0 && board[up][left] === bomb) bombCount++;
            //bomb upper right corner
            if (x > 0 && board[up][right] === bomb) bombCount++;
            //bomb lower left corner
            if (x < lastRow && board[down][left] === bomb) bombCount++;
            //bomb lower right corner
            if (x < lastRow && board[down][right] === bomb) bombCount++;
            if (bombCount > 0) {
                sq.innerText = `${bombCount}`;
                sq.style.color = `${colors[bombCount]}`;
            }
        }
    }
}
//check for safe squares next to the one that was clicked to reveal more safe squares
function checkNeighbors(coordX, coordY) {
    if (coordX < 0 || coordY < 0 || coordX > rows || coordY > cols) return;
    let rightNeighbor = coordY + 1;
    let leftNeighbor = coordY - 1;
    let upNeighbor = coordX - 1;
    let downNeighbor = coordX + 1;
    squareEls.forEach(sq => {
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        if (coordX === x && coordY === y) sq.id = 'safe';
        if ((downNeighbor === x || upNeighbor === x) && coordY === y && board[x][y] === safe) sq.id = 'safe'; 
        if ((rightNeighbor === y || leftNeighbor === y) && coordX === x && board[x][y] === safe) sq.id = 'safe'; 
        if ((upNeighbor === x || downNeighbor === x) && (leftNeighbor === y || rightNeighbor === y) && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === 'safe') sq.disabled = true;
        });
}
//provides indices for placing bombs randomly
function randomIndex(){
    let index = Math.floor(Math.random() * rows);
    return index;
}
/*---only for touch and hold for iOS devices to add flags---*/
const touchDuration = 200; 
let timerInterval;
//at touch start, the duration counts down to see if player wants to add a flag
function touchstart(e) {
    timer(touchDuration);
    function timer(interval) {
        interval--;
        if (interval >= 0) {
            timerInterval = setTimeout(() => {
                timer(interval);
            });
        } else {
            handleRightClick(e);
        }
    }
}
//resets timer interval
function touchend() {
    clearTimeout(timerInterval);
}