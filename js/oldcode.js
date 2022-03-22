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
            //doesn't work
            //safe square is above and/or below 
            // if (sqX > 0 && board[(sqX - 1)][sqY] === bomb || sqX < 7 && board[(sqX + 1)][sqY] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is above and/or below!')
            // }
            if ((sqX > 0 && board[(sqX - 1)][sqY] === bomb) || (sqX < 7 && board[(sqX + 1)][sqY] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is above and/or below!')
            }
            if ((!rightSide && sqX > 0 && board[(sqX - 1)][(sqY - 1)] === bomb) || (sqX < 7 && board[(sqX + 1)][(sqY + 1)] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the left & above!')
            }
            if ((sqX > 0 && i < squareEls.length && board[(sqX - 1)][(sqY + 1)] === bomb) || (sqX < 7 && board[(sqX + 1)][(sqY - 1)] === bomb)) {
                bombCount++;
                sq.innerText = `${bombCount}`;
                console.log('bomb is to the right & above!')
            }
            // //the safe square is on left hand side - IT WORKS
            // if (board[sqX][(sqY+1)] === bomb){
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is to the right!')
            // }
            // safe square above the bomb - IT WORKS
            // if (sqX < 7 && board[(sqX + 1)][sqY] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is below!')
            // }
            // if (!rightSide && sqX > 0 && board[(sqX - 1)][(sqY - 1)] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is to the left & above!')
            // }
            // if (sqX > 0 && board[(sqX - 1)][(sqY + 1)] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb on upper right hand corner')
            // }
            // safe sq diagonally above and to the left
            // if (sqX < 7 && board[(sqX + 1)][(sqY - 1)] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is to the right & below!')
            // }
            // safe sq diagonally above and to the right
            // if (sqX < 7 && board[(sqX + 1)][(sqY + 1)] === bomb) {
            //     bombCount++;
            //     sq.innerText = `${bombCount}`;
            //     console.log('bomb is to the left & below!')
            // }
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
        //if ((coordX - 1) === x && coordY === y && board[x][y] === safe) sq.id = 'safe';
        //if ((coordY - 1) === y && coordX === x && board[x][y] === safe) sq.id = 'safe';
        //if ((coordX + 1) === x  && ((coordY - 1) === y || (coordY+1) === y) && board[x][y] === safe) sq.id = 'safe';
        //if ((coordX - 1) === x && (coordY + 1) === y && board[x][y] === safe) sq.id = 'safe';
        //if ((coordX + 1) === x && (coordY + 1) === y && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === safe) sq.disabled = true;
    });
}