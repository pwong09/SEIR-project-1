/*----constant----*/
const bomb = 1;
const safe = 0;
const maxBombs = 8;

/*----state----*/
let win;
let lose;
let board;
let flags;
let safeSq;


/*----cached eleemtns----*/
const boardEl = document.querySelector('.board');

/*making the board's squares*/
let x = 0;
let y = 0;
for (let i = 0; i < 64; i++) {
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

const squareEl = document.querySelector('.square');
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
    makeBoard();
    placeBombs();
    placeNumbers();
}

function render(){
    if (win) {
        console.log('you win!')
    }
    if (lose) {
        console.log('you lose!')
        //show all bomb locations?
    }
}

function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    let sqX = sq.getAttribute('data-x');
    let sqY = sq.getAttribute('data-y');
    if (board[sqX][sqY] === bomb) {
        lose = true;
        sq.id = 'bomb';
    } else {
        sq.id = 'safe';
        safeSq++;
        checkWinner();
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
    const x = 8;
    board = [];
    for (let i = 0; i < x; i++){
        board[i] = [];
    }
    board.forEach(row => {
        for (let i = 0; i < x; i++){
            row.push(safe);
        }
    })
}
function placeBombs(){
    // need to place maxBombs onto the board randomly
    // each set of (x, y) coordinates = bomb
    const randomArrayX = [];
    const randomArrayY = [];
    for (let i = 0; i < board.length; i++) {
        randomArrayX[i] = Math.floor(Math.random() * 8);
        randomArrayY[i] = Math.floor(Math.random() * 8);
        // if (){
        //     randomArrayX[i] = Math.floor(Math.random() * 8);
        //     randomArrayY[i] = Math.floor(Math.random() * 8);
        if (board[randomArrayX[i]][randomArrayY] === board[randomArrayX[i]][randomArrayY[i]]) {
            randomArrayX[i] = Math.floor(Math.random() * 8);
            randomArrayY[i] = Math.floor(Math.random() * 8);
        }
        board[randomArrayX[i]][randomArrayY[i]] = bomb;
    }   
    console.log(board);
}
function placeNumbers(){
    console.log('I place numbers next to revealed squares with bombs')
    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board.length; j++){
            if(board[i][j] === bomb) {
                squareEl.innerText = '1'; //place a number 1 on the square's innerText 
            }
        }
    }
}
function checkWinner(){
    if (flags === 8 || safeSq === 56) {
        win = true;
    }
}