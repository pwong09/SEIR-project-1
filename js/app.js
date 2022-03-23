/*----constant----*/
const bomb = 1;
const safe = 0;
const colors = {
    1: 'purple',
    2: 'blue',
    3: 'green',
    4: 'yellow',
    5: 'orange',
    6: 'red',
    7: 'brown',
    8: 'black'
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
const replayBtn1 = document.querySelector('.replay-1');
const replayBtn2 = document.querySelector('.replay-2')
const msgEl = document.querySelector('.msg');
const msgBannerEl = document.querySelector('.msg div')

/*----Event Listeners----*/
boardSizeEl.addEventListener('click', changeBoardSize)
boardEl.addEventListener('click', handleLeftClick);
replayBtn1.addEventListener('click', init);
replayBtn2.addEventListener('click', init);
boardEl.addEventListener('contextmenu', handleRightClick);

/*----game play functions----*/
function changeBoardSize(e){
    if (e.target.tagName === 'DIV') return
    if (e.target.className === 'board-size') {
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
    console.log(`number of bombs is ${maxBombs}`)
    boardEl.addEventListener('click', handleLeftClick);
    render();
}

function render(){
        if (lose) {
            msgBannerEl.innerText = 'You Lose!';
            showMessage();
        }
        if (win) {
            msgBannerEl.innerText = 'Winner winner chicken dinner!'
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
    msgEl.style.display = 'flex';
    msgBannerEl.style.width = `${boardX * 35}px`;
    msgBannerEl.style.height = `${boardX * 10}px`;
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
        const squareEl = document.createElement('button');
        squareEl.className = "square";
        squareEl.id = "hidden";
        squareEl.setAttribute('data-x', `${x}`);
        squareEl.setAttribute('data-y', `${y}`);
        squareEl.style.width = `${boardX * 2}px`;
        squareEl.style.height = `${boardX * 2}px`;
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
                console.log(numOfBombs)
                console.log('if statement hitting')
            }
        }
    } else {
        for (let i = 0; i < (boardX*2); i++) {
            let x = randomIndex()
            let y = randomIndex()
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
                console.log(numOfBombs)
                console.log('if statement hitting')
            }
        }
    }
    console.log(board)
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
        let count = 0;
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        if (coordX === x && coordY === y) sq.id = 'safe'; //center
        if (((coordX + 1) === x || (coordX - 1) === x) && coordY === y && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordY + 1) === y || (coordY - 1) === y) && coordX === x && board[x][y] === safe) sq.id = 'safe'; 
        if (((coordX - 1) === x || (coordX + 1) === x) && ((coordY - 1) === y || (coordY + 1) === y) && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === 'safe') sq.disabled = true;
        });
}

