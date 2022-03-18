/*----constant----*/
const bomb = 1;
const safe = 0;
const maxBombs = 8;

/*----state----*/
let win;
let lose;
let board;
let flags;


/*----cached eleemtns----*/
const boardEl = document.querySelector('.board');

let x = 0;
let y = 0;

for (let i = 0; i < 64; i++) {
    const squareEl = document.createElement('button');
    squareEl.className = "square";
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

// const squareEl = document.querySelector('.square');
const squareEls = document.querySelectorAll('.square');
const replayBtn = document.querySelector('.replay');

/*----Event Listeners----*/
boardEl.addEventListener('click', handleLeftClick);
replayBtn.addEventListener('click', init);
//how to add right click?
init()


/*----game play functions----*/
function init(e){
    win = false;
    lose = false;
    flags = 0;
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
    }
    //if square was right clicked, either put a flag on it or remove the flag
}

function handleLeftClick(e){
    let sq = e.target;
    if (sq.tagName === 'SECTION') return;
    console.log(sq)
}
function handleRightClick(e){

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
}