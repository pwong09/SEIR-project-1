#minesweeper pseudocode

html setup
- game title (WIP): Welcome to Pearl's minesweeper!
- game board 
- directions
- some sort of background image / color 

css setup
- initial game board color

//required constants
a hidden square is <blank> color
a safe square is <some> color
a safe numbered square is <some> color (same color as safe square) showing <some> number 
a revealed, bomb square is <some other> color
an array holding the possible numbers for numbered squares? max number is 8 lol
bomb value is 1
empty square value is 0

//required variables that track the state of the game
the board 
a winner variable 
a lose variable

//store elements on the page that will be accessed more than once

//onloading - initialize the state variables
winner starts as false
lose starts as false
make the board function [2d array - an array within an array! make it 8 x 8 ]
  all squares values are set to 0
    another function? place the bombs [8 bombs - randomly placed on the board (random index?)] - value = 1
    function for placing numbered squares? [based on bombs' indices, place corresponding numbered squares adjacent to the bomb
  so if a square is next to one bomb, number 1 should be next to it on all 8 sides
  if there are two bombs, number 2, if there are three bombs, number 3, etc.]

//rendering
within render function:
show the board with all hidden square colors
if winner variable is true - show the winning message / banner with play again button
if lose variable is true - show the losing message with play again button

//wait for the player to left-click a square
within leftHandleClick function:
get the index of the square - represented as [x][y] b/c of 2d array
if the index matches the bomb value -> reveal bomb square, set lose variable to true
if the index matches the empty value 0 -> set the square color to the empty square color
if the index matches the numbers value -> set the square color to the number square color and correspond number
winning function [total square number: 64 minus 8 bombs = 56 squares. If a empty / numbered square is clicked, add 1 to the counter. 
When counter is 56, set win variable to true]


//wait for the player to right-click a square
within rightHandleClick function:
get the index of the square
render the image of a flag onto that square



