#minesweeper pseudocode

html setup
- game title (WIP): Welcome to Pearl's minesweeper!
- game board visual - maybe just the overall board, make the squares in JS?
- directions
- some sort of background image / color 
- winning message
- losing message
- play again button 1 - on the side
- play again button 2 - that shows up with win / lose message

css setup
- initial game board color
- winning message banner
- losing message banner
- play again button 1
- play again button 2

//required constants  
a hidden square is __some__ color  
a safe square is __another__ color  
a revealed, bomb square is **some other** color  
bomb value is 1  
empty square value is 0  

//required variables that track the state of the game
the board   
a win variable - boolean  
a lose variable - boolean  

//store elements on the page that will be accessed more than once  
- 64 squares - make in JS?
- play again button 1
- play again button 2
    
//add eventListeners  
onloading - initialize state variables  
click and right-click on all 64 squares   
    

//onloading - initialize the state variables  
winner set as false  
lose set as false  
make the board function [2d array - an array within an array! make it 8 x 8 - so to access each square => board[i][j] ]  
      
    all squares values are set to 0  
      
    another function? place the bombs [8 bombs - randomly placed on the board (random index?) set all bomb indices' value = 1  
        results in board's indices being changed from 0 to 1. returns bomb indices for numbered squares]
      
    function for placing numbered squares somehow?  
        [get bombs' indices, place a number on the squares adjacent to the bomb  
        so if a square is next to one bomb, number 1 should be next to it on all 8 sides  
        if there are two bombs, number 2, if there are three bombs, number 3, etc.]  

//rendering  
within render function:  
show the board with all hidden square colors  
if winner variable is true - show the winning message / banner with play again button  
if lose variable is true - show the losing message with play again button  
if a square was right clicked: put a flag on it or take a flag off 

//wait for the player to left-click a square  
within leftHandleClick function:  
get the index of the square - represented as [x][y] b/c of 2d array  
if the index matches the bomb value -> reveal bomb square, set lose variable to true  
if the index matches the empty value 0 -> set the square color to the empty square color  
//how to make the empty squares fan out??? check all the neighbors to see if value is 0?
    
winning function - total square number: 64 minus 8 bombs = 56 squares. 
If a safe square is clicked, add 1 to the counter.  
If counter is 56 OR all 8 bombs are flagged - set win variable to true  

//wait for the player to right-click a square  
within rightHandleClick function:  
get the index of the square  
if the square flagged has a bomb - tell the winning function? Or call the winning function to check if player has won  
make a flagged square unclickable for left clicks only   
  



