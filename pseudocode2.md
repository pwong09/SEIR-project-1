# PW minesweeper pseudocode 2
### pseudo code for making multiple board sizes
this pseudo code is to be implemented in addition to original pseudo code (with changes to accomodate multiple board sizes)

html setup 
- add 3 buttons (easy, medium, hard)

css
- style 3 buttons to match other buttons
- add hover states to buttons

//constant variables

//state variables  
board size - full grid?  
max bombs  
board length of one row 

//cached elements
the 3 buttons for board sizes  

//event listeners
click on one of the buttons to trigger board size  

//functions 
//onloading - initialize some state variables like  
win set as false  
lose set as false  
flags set to 0  
safe squares revealed set to 0  

//onclicking one of 3 buttons for board sizes  
initialize board size, max bombs, and board row length variables according to each button
'easy' = 8 x 8 grid with 8 bombs  
no change needed for css  
'medium' = 10 x 10 grid with 10 bombs  
need to change css grid template rows & columns  
'hard = 20 x 20 grid with 20 bombs  
need to change css grid template rows & columns  
initialize make board function  
initialize place bombs function  
initialize boardEl event listener (counter acts win/lose scenario to restart)  
initialize render function  

//need to check all functions in original pseudocode to make everything dynamic to boardSize / boardrow / board.length  
//remember to account for different data types  


//2022.22.03 brainstorming additional features 
- add animation to hidden->safe square reveal
- add animation / something to win/lose scenarios
- check background color & text color for accessibility
- show all bombs upon losing
- add a timer
- add a high score time?