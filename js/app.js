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

/*----Event Listeners----*/
boardSizeEl.addEventListener('click', changeBoardSize)
replayBtn.addEventListener('click', init);
boardEl.addEventListener('contextmenu', handleRightClick);
boardEl.addEventListener('click', handleLeftClick);

/*----game play functions----*/
function changeBoardSize(e){
    if (e.target.tagName === 'DIV') return
    if (e.target.className === 'board-size') {
        boardEl.style.display = 'grid';
        if (e.target.innerText === 'Easy') {
            rows = 8;
            cols = 8;
            boardSize = rows * cols;

        } else if (e.target.innerText === 'Medium') {
            rows = 10;
            cols = 10;
            boardSize = rows * cols;

        } else if (e.target.innerText === 'Hard') {
            rows = 20;
            cols = 20;
            boardSize = rows * cols;
        }
    }
makeBoard();
init();
}

function init(e){
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

function render(){
    if (lose) {
        msgEl.style.color = 'yellow';
        msgEl.innerText = 'Game Over';
        }
    if (win) {
        msgEl.style.color = 'orange';
        msgEl.innerText = 'Winner, winner, chicken dinner!';
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

function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    let x = parseInt(sq.getAttribute('data-x'));
    let y = parseInt(sq.getAttribute('data-y'));
    if (board[x][y] === bomb) {
        sq.id = 'bomb';
        sq.innerText = '💣';
        lose = true;
    } else {
        checkNeighbors(x, y);
    }
checkWinner();
render();
}

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
function checkWinner(){
    let count = 0;
    squareEls.forEach(sq => {
        if (sq.id === 'safe') count++;
        if (flags === maxBombs) win = true;
    });
    if (count === (boardSize - maxBombs)) win = true;
}
function showMessage(){
    let width = boardEl.clientWidth;
    msgEl.style.display = 'flex';
    msgEl.style.width = `${width}px`;
    msgEl.style.height = `${width}px`;
    replayBtn.style.display = 'revert';
}
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
    boardSize = rows * cols;
    boardEl.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    boardEl.style.gridTemplateRows =  `repeat(${cols}, 1fr)`;
    /*make the board's squares and coordinates*/
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

function placeNumbers(){
    for (let i = 0; i < boardSize; i++) {
        let bombCount = 0;
        let sq = squareEls[i];
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        let leftSide = i % rows === 0;
        let rightSide = i % rows === .875;
        let lastRow = rows - 1;
        if (board[x][y] === safe) {
            if (board[x][(y-1)] === bomb && !leftSide) bombCount++;
            if (!rightSide && board[x][(y+1)] === bomb) bombCount++;
            if (x > 0 && board[(x - 1)][y] === bomb) bombCount++;
            if (x < lastRow && board[(x + 1)][y] === bomb) bombCount++;
            if (!rightSide &&x > 0 && board[(x - 1)][(y - 1)] === bomb) bombCount++;
            if (x > 0 && board[(x - 1)][(y + 1)] === bomb) bombCount++;
            if (x < lastRow && board[(x + 1)][(y - 1)] === bomb) bombCount++;
            if (x < lastRow && board[(x + 1)][(y + 1)] === bomb) bombCount++;
            if (bombCount > 0) {
                sq.innerText = `${bombCount}`;
                sq.style.color = `${colors[bombCount]}`;
            }
        }
    }
}

function checkNeighbors(coordX, coordY) {
    if (coordX < 0 || coordY < 0 || coordX > rows || coordY > cols) return;
    squareEls.forEach(sq => {
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        if (coordX ===x && coordY === y) sq.id = 'safe'; //center
        if (((coordX + 1) ===x || (coordX - 1) === x) && coordY === y && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordY + 1) === y || (coordY - 1) === y) && coordX ===x && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordX - 1) ===x || (coordX + 1) ===x) && ((coordY - 1) === y || (coordY + 1) === y) && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === 'safe') sq.disabled = true;
        });
}

function randomIndex(){
    let index = Math.floor(Math.random() * rows);
    return index;
}

//touch and hold for iOS devices to add flags
const touchDuration = 300; 
let timerInterval;


function touchstart(e) {
    let sq = e.target;
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

function touchend() {
    clearTimeout(timerInterval);
}



boardEl.addEventListener('touchstart',touchstart);
boardEl.addEventListener('touchend',touchend);