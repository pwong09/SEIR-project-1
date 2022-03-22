/*----constant----*/
const bomb = 1;
const safe = 0;;

/*----state----*/
let win;
let lose;
let board;
let flags;
let safeSq;
let boardX = 8;
let maxBombs = 8;
let boardSize = 64;

/*Game Start*/
/*----cached elements----*/
const boardEl = document.querySelector('.board');
//const boardSizeEl = document.querySelector('.board-sizes')
//boardSizeEl.addEventListener('click', gameStart)


// function gameStart(e){
//     if (e.target.tagName === 'DIV') return
//     if (e.target.tagName === 'BUTTON') {
//         if (e.target.innerText === 'Easy') {
//             boardSize = 64;
//             boardX = 8;
//             maxBombs = 8;
//         } else if (e.target.innerText === 'Medium') {
//             boardSize = 100;
//             boardX = 10;
//             maxBombs = 10;
//         } else if (e.target.innerText === 'Hard') {
//             boardSize = 400;
//             boardX = 20;
//             maxBombs = 20;
//         }
//     }
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
        if (y < (boardX - 1)) {
            y++;
        } else {
            y = 0;
            x++;
    }
}
// };


//const squareEl = document.querySelector('.square');
const squareEls = document.querySelectorAll('.square');
const replayBtn1 = document.querySelector('.replay-1');
const replayBtn2 = document.querySelector('.replay-2')
const msgEl = document.querySelector('.msg');
const msgBannerEl = document.querySelector('.msg div')

/*----Event Listeners----*/

boardEl.addEventListener('click', handleLeftClick);
replayBtn1.addEventListener('click', init);
replayBtn2.addEventListener('click', init);
boardEl.addEventListener('contextmenu', handleRightClick);
init()

/*----game play functions----*/
function init(e){
    msgEl.style.display = 'none';
    squareEls.forEach(sq => {
        sq.innerText = '';
        sq.id = 'hidden'
        sq.disabled = false;
    });
    win = false;
    lose = false;
    flags = 0;
    safeSq = 0;
    makeBoard();
    placeBombs(maxBombs);
    boardEl.addEventListener('click', handleLeftClick);
    render();
}

function render(){
        if (lose) {
            msgEl.style.display = 'flex';
            msgBannerEl.innerText = 'You Lose!';
            boardEl.removeEventListener('click', handleLeftClick);
            console.log('you lose!')
        }
        if (win) {
            msgEl.style.display = 'flex';
            msgBannerEl.innerText = 'Winner winner chicken dinner!'
            boardEl.removeEventListener('click', handleLeftClick);
            console.log('you win!')
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
    console.log(`the board: ${board}`)
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
        let leftSide = i % boardX === 0;
        let rightSide = i % boardX === .875;
        if (board[sqX][sqY] === safe) {
            //sq is safe
            // the safe square on right side
            if (board[sqX][(sqY-1)] === bomb && !leftSide) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left!')
            }
            //safe square is on left side
            if (!rightSide && board[sqX][(sqY+1)] === bomb){
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the right!')
            }
            //safe square is above
            if ((sqX > 0 && board[(sqX - 1)][sqY] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is below!')
            }
            //safe square is below
            if ((sqX < 7 && board[(sqX + 1)][sqY] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is above!')
            }
            //safe square is diagonally above and/or below
            if (!rightSide && sqX > 0 && board[(sqX - 1)][(sqY - 1)] === bomb) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left & above!')
            }
            if (sqX > 0 && board[(sqX - 1)][(sqY + 1)] === bomb) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb on upper right hand corner')
            }
            if (sqX < 7 && board[(sqX + 1)][(sqY - 1)] === bomb) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the right & below!')
            }
            // safe sq diagonally above and to the right
            if (sqX < 7 && board[(sqX + 1)][(sqY + 1)] === bomb) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left & below!')
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