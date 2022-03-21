/*----constant----*/
const bomb = 1;
const safe = 0;
const boardSize = 64;

/*----state----*/
let win;
let lose;
let board;
let flags;
let safeSq;
let boardX;
let maxBombs;

/*----cached elements----*/
const boardEl = document.querySelector('.board');

/*making the board's squares*/
let x = 0;
let y = 0;
for (let i = 0; i < (boardSize); i++) {
    const squareEl = document.createElement('button');
    squareEl.className = "square";
    squareEl.id = "hidden";
    squareEl.setAttribute('data-x', `${x}`);
    squareEl.setAttribute('data-y', `${y}`);
    boardEl.appendChild(squareEl);
    if (y < 7) {
        y++;
    } else {
        y = 0;
        x++;
    }
}

//const squareEl = document.querySelector('.square');
const squareEls = document.querySelectorAll('.square');
const replayBtn = document.querySelector('.replay');

/*----Event Listeners----*/
boardEl.addEventListener('click', handleLeftClick);
replayBtn.addEventListener('click', init);
boardEl.addEventListener('contextmenu', handleRightClick);
init()

/*----game play functions----*/
function init(e){
    win = false;
    lose = false;
    flags = 0;
    safeSq = 0;
    maxBombs = 8;
    boardX = maxBombs;
    makeBoard();
    placeBombs(maxBombs);
    squareEls.forEach(sq => {
        sq.id = 'hidden'
        sq.disabled = false;
    });
    render();
}

function render(){
    squareEls.forEach(sq => {
        let sqX = sq.getAttribute('data-x');
        let sqY = sq.getAttribute('data-y');
        if (lose) {
            console.log('you lose!')
            if (board[sqX][sqY] === bomb) {
                sq.id = 'bomb';
            }
            boardEl.removeEventListener('click', handleLeftClick);
        }
        if (win) {
            console.log('you win!')
            if (board[sqX][sqY] === bomb) {
                sq.id = 'bomb';
            }
            boardEl.removeEventListener('click', handleLeftClick);
        }
    });//end of for loop
    
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
        checkWinner();
        console.log(`safe squares revealed: ${safeSq}`)
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
    if (sq.id === 'hidden' ){
        sq.id = "flag";
        sq.disabled = true;
    } else {
        sq.id = 'hidden';
        sq.disabled = false;
    }
    if (board[sqX][sqY] === bomb) {
        flags++
        checkWinner();
    }
render();
}

/*----helper functions----*/
function makeBoard(){
    board = [];
    for (let i = 0; i < boardX; i++){
        board[i] = [];
    }
    board.forEach(row => {
        for (let i = 0; i < boardX; i++){
            row.push(safe);
        }
    })
}
function placeBombs(max){
    let numOfBombs = 0;
    const randomArrayX = [];
    const randomArrayY = [];
    for (let i = 0; i < boardX; i++) {
        randomArrayX[i] = Math.floor(Math.random() * boardX);
        randomArrayY[i] = Math.floor(Math.random() * boardX);
        
        board[randomArrayX[i]][randomArrayY[i]] = bomb;
        numOfBombs++;
    }
    max = numOfBombs;
    console.log(randomArrayX)
    console.log(randomArrayY)
    console.log(`I've placed ${numOfBombs} bombs muahahahah`)
    console.log(board);
    placeNumbers();
    return max;
}
function placeNumbers(){
    for (let i = 0; i < squareEls.length; i++) {
        let bombCount = 0;
        let sq = squareEls[i];
        let sqX = parseInt(sq.getAttribute('data-x'));
        let sqY = parseInt(sq.getAttribute('data-y'));
        // let leftSide = i % boardX === 0;
        let rightSide = i % boardX === .875;
        if (board[sqX][sqY] === safe) {
            //sq is safe
            //the safe square on right and/or left hand side - IT WORKS
            if ((board[sqX][(sqY-1)] === bomb || board[sqX][(sqY+1)] === bomb) && !rightSide) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left and/or right!')
            }
            //safe square is above and/or below 
            if ((sqX > 0 && board[(sqX - 1)][sqY] === bomb) || (sqX < 7 && board[(sqX + 1)][sqY] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is above and/or below!')
            }
            //safe square is diagonally above and/or below
            if ((!rightSide && sqX > 0 && board[(sqX - 1)][(sqY - 1)] === bomb) || (sqX < 7 && board[(sqX + 1)][(sqY + 1)] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left & above!')
            }
            //safe square is diagonally above and/or below
            if ((sqX > 0 && i < squareEls.length && board[(sqX - 1)][(sqY + 1)] === bomb) || (sqX < 7 && board[(sqX + 1)][(sqY - 1)] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the right & above!')
            }
        }
    } //end of for loop
}

function checkNeighbors(coordX, coordY) {
        squareEls.forEach(sq => {
            let x = parseInt(sq.getAttribute('data-x'));
            let y = parseInt(sq.getAttribute('data-y'));
            if (coordX === x && coordY === y) sq.id = 'safe'; //center
            if (((coordX + 1) === x || (coordX - 1) === x) && coordY === y && board[x][y] === safe) sq.id = 'safe';
            if (((coordY + 1) === y || (coordY - 1) === y) && coordX === x && board[x][y] === safe) sq.id = 'safe';
            if (((coordX - 1) === x || (coordX + 1) === x) && ((coordY - 1) === y || (coordY + 1) === y) && board[x][y] === safe) sq.id = 'safe';
            if (sq.id === safe) sq.disabled = true;
        });
    }


function checkWinner(){
    if (flags === maxBombs || safeSq === (squareEls.length - maxBombs)) {
        win = true;
    }
}