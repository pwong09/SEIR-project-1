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
    makeBoard();
    placeBombs();
}

function render(){
    for (let i = 0; i < 64; i++) {
        let sq = squareEls[i];
        let sqX = sq.getAttribute('data-x');
        let sqY = sq.getAttribute('data-y');
        if (lose) {
            console.log('you lose!')
            if (board[sqX][sqY] === bomb) {
                sq.id = 'bomb';
            }
            boardEl.removeEventListener('click', handleLeftClick);
        }
    } //end of for loop
    if (win) {
        console.log('you win!')
    }
    
}

function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    let sqX = sq.getAttribute('data-x');
    let sqY = sq.getAttribute('data-y');
    if (board[sqX][sqY] === bomb) {
        sq.id = 'bomb';
        lose = true;
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
    placeNumbers(board)
}
function placeNumbers(array2D){
    for (let i = 0; i < 64; i++) {
        let sq = squareEls[i];
        let sqX = sq.getAttribute('data-x');
        let sqY = sq.getAttribute('data-y');
        let leftSide = i % 8 === 0;
        let rightSide = i % 8 === .875;
        if (board[sqX][sqY] === bomb) {
            console.log(sq);
            console.log(i); //this is where the bomb is!
            //8 squares to change around the bomb
            if (!leftSide) {
                squareEls[(i - 1)].innerText = 1;
            }
            if (!rightSide) {
                squareEls[(i + 1)].innerText = 1;
            }

            

        }
    } //end of for loop
    console.log('I place numbers next to revealed squares with bombs');
}
function checkWinner(){
    if (flags === 8 || safeSq === 57) {
        win = true;
    }
}