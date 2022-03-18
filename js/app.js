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
    placeBombs(maxBombs);
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

        boardEl.removeEventListener('click', handleLeftClick);
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
        console.log(safeSq)
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
function placeBombs(max){
    const randomArrayX = [];
    const randomArrayY = [];
    for (let i = 0; i < board.length; i++) {
        randomArrayX[i] = Math.floor(Math.random() * maxBombs);
        randomArrayY[i] = Math.floor(Math.random() * maxBombs);
        if (randomArrayX[i] === randomArrayY[i]) {
            randomArrayX[i] = Math.floor(Math.random() * maxBombs);
            randomArrayY[i] = Math.floor(Math.random() * maxBombs);
        } else {
            board[randomArrayX[i]][randomArrayY[i]] = bomb;
        }  
    }
    //need to figure out how to make sure number of bombs placed === max (maxBombs which is 8)
    console.log(board);
    placeNumbers(board)
}
function placeNumbers(array2D){
        let bombCount = 0;
    for (let i = 0; i < 64; i++) {
        let sq = squareEls[i];
        let sqX = sq.getAttribute('data-x');
        let sqY = sq.getAttribute('data-y');
        let leftSide = i % 8 === 0;
        let rightSide = i % 8 === .875;
        //bombCount++; //goes up for 64 times
        if (board[sqX][sqY] === bomb) {
            bombCount++; //this increases every time we find a bomb, but not for touching multiple bombs
            console.log(sq); //this is where the bomb is!
            //8 squares to change around the bomb
            //square on left hand side
            if (!leftSide) squareEls[(i - 1)].innerText = `${bombCount}`;
            //square on right hand side
            if (!rightSide && i < 63) squareEls[(i + 1)].innerText = `${bombCount}`;
            //square below i is +8
            if (i > 0 && i < 56) squareEls[(i + 8)].innerText = `${bombCount}`;
            //square above i is -8
            if (i > 7 && i < 63) squareEls[(i - 8)].innerText = `${bombCount}`;
            //squares diagonally above and to the left 
            if (!leftSide && i > 8) squareEls[(i - 9)].innerText = `${bombCount}`;
            //squares diagonally above and to the right
            if (!rightSide && i > 8 && i < 63) squareEls[i - 7].innerText = `${bombCount}`;
            //squares diagonally below and to the left
            if (!leftSide && i < 56) squareEls[(i + 7)].innerText = `${bombCount}`;
            //squares diagonally below and to the right
            if (!rightSide && i < 55) squareEls[(i + 9)].innerText = `${bombCount}`;
            //bombCount++; //bombCount starts at 0 for finding the first bomb, so no thanks
            
        }
        //bombCount--;//bombcount always at 1
    } //end of for loop
}
function checkWinner(){
    if (flags === 8 || safeSq === 56) {
        win = true;
    }
}