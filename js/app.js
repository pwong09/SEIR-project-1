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

/*----state----*/
let win;
let lose;
let board;
let flags;
let boardSize;
let boardX;
let boardY;
let maxBombs;

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
boardEl.addEventListener('long-press', handleRightClick);

/*----game play functions----*/
function changeBoardSize(e){
    if (e.target.tagName === 'DIV') return
    if (e.target.className === 'board-size') {
        boardEl.style.display = 'grid';
        if (e.target.innerText === 'Easy') {
            boardX = 10;
            boardY = 10;
            boardSize = boardX * boardY;
            boardEl.style.gridTemplateColumns = `repeat(${boardX}, 1fr)`;
            boardEl.style.gridTemplateRows =  `repeat(${boardY}, 1fr)`;

        } else if (e.target.innerText === 'Medium') {
            boardX = 13;
            boardY = 13;
            boardSize = boardX * boardY;
            boardEl.style.gridTemplateColumns = `repeat(${boardX}, 1fr)`;
            boardEl.style.gridTemplateRows =  `repeat(${boardY}, 1fr)`;

        } else if (e.target.innerText === 'Hard') {
            boardX = 20;
            boardY = 20;
            boardSize = boardX * boardY;
            boardEl.style.gridTemplateColumns = `repeat(${boardX}, 1fr)`;
            boardEl.style.gridTemplateRows = `repeat(${boardY}, 1fr)`;

        }
    }
makeBoard();
init();
}

function init(e){
    const squareEls = document.querySelectorAll('.square');
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
            msgEl.innerText = 'Game Over';
            showMessage();
        }
        if (win) {
            msgEl.style.color = 'orange';
            msgEl.innerText = 'Winner, winner, chicken dinner!'
            showMessage();
        }
}

function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    let sqX = parseInt(sq.getAttribute('data-x'));
    let sqY = parseInt(sq.getAttribute('data-y'));
    if (board[sqX][sqY] === bomb) {
        sq.id = 'bomb';
        lose = true;
    } else {
        checkNeighbors(sqX, sqY);
    }
render();
}

function handleRightClick(e){
    e.preventDefault();
    let sq = e.target;
    let sqX = sq.getAttribute('data-x');
    let sqY = sq.getAttribute('data-y');
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
    if (sq.id === 'flag' && board[sqX][sqY] === bomb) flags++;
    checkWinner();
render();
}

/*----helper functions----*/
function checkWinner(){
    const squareEls = document.querySelectorAll('.square');
    squareEls.forEach(sq => {
        let sqX = parseInt(sq.getAttribute('data-x'));
        let sqY = parseInt(sq.getAttribute('data-y'));
        if (flags === maxBombs) win = true;
    });
}
function showMessage(){
    let width = boardEl.clientWidth;
    msgEl.style.display = 'flex';
    msgEl.style.width = `${width}px`;
    msgEl.style.height = `${width}px`;
    replayBtn.style.display = 'revert';
    boardEl.removeEventListener('click', handleLeftClick);
}
function makeBoard(){
    board = [];
    for (let i = 0; i < boardX; i++){
        board[i] = [];
    }
    board.forEach(row => {
        for (let i = 0; i < boardX; i++){
            row.push(safe);
        }
    });
    /*making the board's squares and coordinates*/
    if (boardEl.childElementCount === 0 || boardEl.childElementCount !== boardSize) {
    while (boardEl.firstChild) {
            boardEl.removeChild(boardEl.firstChild);
    }
    let x = 0;
    let y = 0;
    for (let i = 0; i < boardSize; i++) {
        let width = boardEl.clientWidth;
        let sqWidth = width / boardX;
        const squareEl = document.createElement('button');
        squareEl.className = "square";
        squareEl.id = "hidden";
        squareEl.setAttribute('data-x', `${x}`);
        squareEl.setAttribute('data-y', `${y}`);
        squareEl.style.width = `${sqWidth}px`;
        squareEl.style.height = `${sqWidth}px`;
        boardEl.appendChild(squareEl);
        if (y < (boardX - 1)) {
            y++;
        } else {
            y = 0;
            x++;
        }
    }
}
}
function placeBombs(){
    let numOfBombs = 0;
    for(let i = 0; i < boardX; i++) {
        for (let j = 0; j < boardX; j++) {
            board[i][j] = safe;
        }
    }
    if (boardX < 11) {
        for (let i = 0; i < (boardX); i++) {
            let x = randomIndex()
            let y = randomIndex()
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
            }
        }
    } else {
        for (let i = 0; i < (boardX*2); i++) {
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

function randomIndex(){
    let index = Math.floor(Math.random() * boardX);
    return index;
}

function placeNumbers(){
    const squareEls = document.querySelectorAll('.square');
    for (let i = 0; i < boardSize; i++) {
        let bombCount = 0;
        let sq = squareEls[i];
        let sqX = parseInt(sq.getAttribute('data-x'));
        let sqY = parseInt(sq.getAttribute('data-y'));
        let leftSide = i % boardX === 0;
        let rightSide = i % boardX === .875;
        let lastRow = boardX - 1
        if (board[sqX][sqY] === safe) {
            if (board[sqX][(sqY-1)] === bomb && !leftSide) bombCount++;
            if (!rightSide && board[sqX][(sqY+1)] === bomb) bombCount++;
            if ((sqX > 0 && board[(sqX - 1)][sqY] === bomb)) bombCount++;
            if ((sqX < lastRow && board[(sqX + 1)][sqY] === bomb)) bombCount++;
            if (!rightSide && sqX > 0 && board[(sqX - 1)][(sqY - 1)] === bomb) bombCount++;
            if (sqX > 0 && board[(sqX - 1)][(sqY + 1)] === bomb) bombCount++;
            if (sqX < lastRow && board[(sqX + 1)][(sqY - 1)] === bomb) bombCount++;
            if (sqX < lastRow && board[(sqX + 1)][(sqY + 1)] === bomb) bombCount++;
            if (bombCount > 0) {
                sq.innerText = `${bombCount}`;
                sq.style.color = `${colors[bombCount]}`;
            }
        }
    }
}

function checkNeighbors(coordX, coordY) {
    const squareEls = document.querySelectorAll('.square');
    squareEls.forEach(sq => {
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        if (coordX === x && coordY === y) sq.id = 'safe'; //center
        if (((coordX + 1) === x || (coordX - 1) === x) && coordY === y && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordY + 1) === y || (coordY - 1) === y) && coordX === x && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordX - 1) === x || (coordX + 1) === x) && ((coordY - 1) === y || (coordY + 1) === y) && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === 'safe') sq.disabled = true;
        });
}

//trying long touch for IOS
//need touchstart, touchend, a timer
//fire flagging function (handleRightClick)
let longTouch;
let timer;
let touchDuration = 500; //length of time we want the user to touch before we do something

function touchStart(e) {
    if (!timer) {
        timer = setTimeout(longTouch, touchDuration); 
    }
    console.log(timer)
}

function touchEnd() {
    //stops short touches from firing the event
    if (timer)
        clearTimeout(timer);
        timer = null;
}
