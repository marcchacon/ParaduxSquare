
# Paradux Square
This is a JavaScript code to play a game called [Paradux](https://boardgamegeek.com/boardgame/7981/paradux), but on a square board, as a concept.
You can play it [here](https://marcchacon.github.io/ParaduxSquare/)!

Thanks to @danielborowski for creating [jsboard](https://github.com/danielborowski/jsboard)!

## Rules
### Moves
Each turn consists in three steps:
1. Select any piece, doesn't matter the color
2. Select an adjacent piece of the opposite color (if you selected white at step 1, now you must select black)
3. Here you have two options: Move the two pieces along or swap them.
    - If you choose to move them, you can move them in any direction one space. The pieces must move along.
Then it's the other player's turn, that plays the same.

### Winning condition
You win if you get 4 in a row with your pieces. Diagonals are not valid.
If you make 4 in a row with the other player's pieces, they win.
#### 6 in a row mode
No explanation needed, the winning condition is now 6 in a row instead of 4.

### Board sizes
In the original game there are 4 games at the center, but with a 6x6 board it feels a bit too much. That's why there is a bigger board option, with those middle pieces. It makes it a bit more challenging!

