// The directions a piece can move
const directions = [
    //[-1, -1], // adalt esquerra
    [-1, 0], // adalt
    //[-1, 1], // adalt dreta
    [0, -1], // esquerra
    [0, 1], // dreta
    //[1, -1], // abaix esquerra
    [1, 0], // abaix
    //[1, 1], // abaix dreta
];
const moves = [
    [-1, -1], // adalt esquerra
    [-1, 0], // adalt
    [-1, 1], // adalt dreta
    [0, -1], // esquerra
    [0, 1], // dreta
    [1, -1], // abaix esquerra
    [1, 0], // abaix
    [1, 1], // abaix dreta
];

// setup pieces
var player1 = jsboard.piece({ text: "P1", textIndent: "-9999px", background: "white", width: "60px", height: "60px", margin: "0 auto", "border-radius": "50%" });
var player2 = jsboard.piece({ text: "P2", textIndent: "-9999px", background: "black", width: "60px", height: "60px", margin: "0 auto", "border-radius": "50%" });

// variables for turns, piece to move and its locs
var turn = ["P1", "P2"];
var bindMoveLocs, bindMovePiece, firstPiece;
var started, win = false;
let P1, P2 = [];
var gamemode = 4;

//Aux functions
let selectSecondFunction = function () { selectSecond(this); };
let showMovesFunction = function () { showMoves(this); };
let reversePiecesFunction = function () { reversePieces(); };


initTable();  // 5x5 board

/**
 *  Select the second piece to move
 * @param {*} piece The piece that has been clicked
 * @returns {void}
 */
function selectSecond(piece) {

    // check if game has ended
    if (win) return

    resetBoard()

    firstPiece = piece;

    var possiblePairs = getAdjacent(b.cell(piece.parentNode).where())

    //Add listeners to possible pairs
    possiblePairs.forEach((pair) => {

        //Add Player color to the possible pairs
        if (turn[0] == "P2") {
            b.cell(pair).DOM().classList.add("red");
        } else b.cell(pair).DOM().classList.add("blue");

        //Add listener to the possible pairs
        //As you can't click a piece that is the same color as the one you are moving,
        //there is no need to do a foreach to both P1 and P2 at the same time 
        if (b.cell(piece.parentNode).get() == "P2") {
            P1.forEach((p) => {
                if (p[1].toString() == pair.toString()) {
                    p[0].removeEventListener("click", selectSecondFunction);
                    p[0].addEventListener("click", showMovesFunction);
                }
            })
        } else {
            P2.forEach((p) => {
                if (p[1].toString() == pair.toString()) {
                    p[0].removeEventListener("click", selectSecondFunction);
                    p[0].addEventListener("click", showMovesFunction);
                }
            })
        }

    })
}

/**
 * This function is called when the seccond piece is clicked for a second time. Will excange the first and second piece
 */
function reversePieces() {

    var firstPiece = bindMovePiece[0];
    var secondPiece = bindMovePiece[1];

    var firstPos = b.cell(firstPiece.parentNode).where();
    var secondPos = b.cell(secondPiece.parentNode).where();

    //Move pieces
    b.cell(firstPos).place(secondPiece);
    b.cell(secondPos).place(firstPiece);

    //Update P1 and P2 arrays
    P1.find((p) => {
        if (p[1].toString() == firstPos.toString()) {
            p[1] = secondPos;
        } else if (p[1].toString() == secondPos.toString()) {
            p[1] = firstPos;
        }
    })
    P2.find((p) => {
        if (p[1].toString() == firstPos.toString()) {
            p[1] = secondPos;
        } else if (p[1].toString() == secondPos.toString()) {
            p[1] = firstPos;
        }
    })
    

    resetBoard();
    //Update turn
    var temp = turn.shift();
    turn.push(temp);

    //Update turn text
    switch (turn[0]) {
        case "P1":
            document.getElementById("turn").innerHTML = `It's P1 turn to move`
            break;
        case "P2":
            document.getElementById("turn").innerHTML = `It's P2 turn to move`;
            break;
    }
    winCheck();
}

/**
 * Show the possible moves for the selected pieces
 * 
 * @param {HTMLElement} secondPiece The second piece that has been clicked
 */
function showMoves(secondPiece) {

    // check if game has ended
    if (win) return

    resetBoard()

    // parentNode is needed because the piece you are clicking 
    // on doesn't have access to cell functions, therefore you 
    // need to access the parent of the piece because pieces are 
    // always contained within in cells
    var loc = b.cell(firstPiece.parentNode).where();
    var loc2 = b.cell(secondPiece.parentNode).where();
    console.log(`loc: ${loc} loc2: ${loc2}`)
    var newLocs = getMoves(loc2, loc);

    // remove illegal moves by checking 
    // content of b.cell().get()
    (function removeIllegalMoves(arr) {
        var fixedLocs = [];
        for (var i = 0; i < arr.length; i++)
            if (b.cell(arr[i][0]).get() == null && (b.cell(arr[i][1]).get() == null || arr[i][1].toString() == loc2.toString()))
                fixedLocs.push(arr[i]);
        newLocs = fixedLocs;
    })(newLocs);

    newLocs.push([loc2, loc]);

    // bind green spaces to movement of piece
    bindMoveLocs = newLocs.slice();
    bindMovePiece = [secondPiece, firstPiece];
    bindMoveEvents(bindMoveLocs);
}

/**
 * Creates the listeners and shows the possible moves
 * 
 * @param {Array} locs Possible moves
 */
function bindMoveEvents(locs) {

    // add color spaces to possible moves
    for (var i = 0; i < locs.length-1; i++) {

        if (turn[0] == "P2") {
            b.cell(locs[i][0]).DOM().classList.add("red");
        } else b.cell(locs[i][0]).DOM().classList.add("blue");
        
        b.cell(locs[i][0]).on("click", movePiece);
    }

    b.cell(locs[locs.length-1][0]).DOM().classList.add("green");

    // Add listener to the piece that can be clicked
    // Remove the first listener so you don't trigger two listeners at the same time
    var piece = b.cell(locs[locs.length-1][0]).get()
    if (piece == "P1") {
        P1.forEach((p) => {
            if (p[1].toString() == locs[locs.length-1][0].toString()) {
                p[0].removeEventListener("click", selectSecondFunction);
                p[0].addEventListener("click", reversePiecesFunction);
            }
        })
    } else {
        P2.forEach((p) => {
            if (p[1].toString() == locs[locs.length-1][0].toString()) {
                p[0].removeEventListener("click", selectSecondFunction);
                p[0].addEventListener("click", reversePiecesFunction);
            }
        })
    }

}

/**
 * Move the piece to the clicked location
 * 
 * @return {void}
 */
function movePiece() {

    started = true;

    var userClick = b.cell(this).where();

    var oldpos = [b.cell(bindMovePiece[0].parentNode).where(), b.cell(bindMovePiece[1].parentNode).where()];
    var newpos;

    // check if user clicked on a green cell
    var legalMove = false;
    for (var i = 0; i < bindMoveLocs.length; i++) {
        if (bindMoveLocs[i][0].toString() == userClick.toString()) {
            newpos = bindMoveLocs[i];
            legalMove = true;
            break;
        }
    }
    if (!legalMove) return;

    //Move pieces
    b.cell(newpos[0]).place(bindMovePiece[0]);
    b.cell(newpos[1]).place(bindMovePiece[1]);

    //Update P1 and P2 arrays
    P1.forEach((p) => {
        if (p[1].toString() == oldpos[0].toString()) {
            p[1] = newpos[0];
        } else if (p[1].toString() == oldpos[1].toString()) {
            p[1] = newpos[1];
        }
    });
    P2.forEach((p) => {
        if (p[1].toString() == oldpos[0].toString()) {
            p[1] = newpos[0];
        } else if (p[1].toString() == oldpos[1].toString()) {
            p[1] = newpos[1];
        }
    });

    //Update turn
    var temp = turn.shift();
    turn.push(temp);

    //Update turn text
    switch (turn[0]) {
        case "P1":
            document.getElementById("turn").innerHTML = `It's P1 turn to move`
            break;
        case "P2":
            document.getElementById("turn").innerHTML = `It's P2 turn to move`;
            break;
    }

    resetBoard();
    winCheck();
    
}

/**
 * Reset the board by removing all green cells and
 * removing all click events.
 * If hard is true, also resets the game
 * 
 * @param {boolean} hard If true, also resets the game
 * @return {void}
 */
function resetBoard(hard = false) {

    for (var r = 0; r < b.rows(); r++) {
        for (var c = 0; c < b.cols(); c++) {
            b.cell([r, c]).DOM().classList.remove("green");
            b.cell([r, c]).DOM().classList.remove("blue");
            b.cell([r, c]).DOM().classList.remove("red");
            b.cell([r, c]).removeOn("click", movePiece);
            b.cell([r, c]).removeOn("click", showMoves);

            if (hard) b.cell([r, c]).rid();
        }
    }

    if (hard) {

        //config reset
        if (started && !win) {
            var text = "Do you really want to restart the game?";
            if (!confirm(text)) return
        }

        // reset game state
        started = false;
        win = false;

        //put pieces in place
        P1 = [];
        P2 = [];
        var switcher = false;
        for (let i = 0; i < b.cols(); i++) {
            var posP1 = [0, i];
            var posP2 = [b.rows() - 1, i];

            if (switcher) [posP1, posP2] = [posP2, posP1];

            P1.push([player1.clone(), posP1]);
            P2.push([player2.clone(), posP2]);
            b.cell(posP1).place(P1[P1.length - 1][0]);
            b.cell(posP2).place(P2[P2.length - 1][0]);

            P1[i][0].addEventListener("click", selectSecondFunction);
            P2[i][0].addEventListener("click", selectSecondFunction);

            switcher = !switcher;

        }

        // Add pieces to the left and right sides of the board
        switcher = !switcher;
        for (let i = 1; i < b.rows() - 1; i++) {
            var posP1 = [i, 0];
            var posP2 = [i, b.cols() - 1];

            if (switcher) [posP1, posP2] = [posP2, posP1];

            P1.push([player1.clone(), posP1]);
            P2.push([player2.clone(), posP2]);

            b.cell(posP1).place(P1[P1.length - 1][0]);
            b.cell(posP2).place(P2[P2.length - 1][0]);

            P1[P1.length - 1][0].addEventListener("click", selectSecondFunction);
            P2[P2.length - 1][0].addEventListener("click", selectSecondFunction);

            switcher = !switcher;
        }

        if (b.cols()  >= 8) {
            posP1 = [3, 2];
            posP2 = [3, b.rows()-3];
            P1.push([player1.clone(), posP1]);
            P2.push([player2.clone(), posP2]);
            b.cell(posP1).place(P1[P1.length - 1][0]);
            b.cell(posP2).place(P2[P2.length - 1][0]);
            P1[P1.length - 1][0].addEventListener("click", selectSecondFunction);
            P2[P2.length - 1][0].addEventListener("click", selectSecondFunction);

            posP1 = [4, b.rows()-3];
            posP2 = [4, 2];
            P1.push([player1.clone(), posP1]);
            P2.push([player2.clone(), posP2]);
            b.cell(posP1).place(P1[P1.length - 1][0]);
            b.cell(posP2).place(P2[P2.length - 1][0]);
            P1[P1.length - 1][0].addEventListener("click", selectSecondFunction);
            P2[P2.length - 1][0].addEventListener("click", selectSecondFunction);
        } 


        turn = ["P1", "P2"];
        document.getElementById("turn").innerHTML = `It's P1 turn to move`;
    }
    //Remove listeners from pieces, and add the selectSecond (base) listener
    P1.forEach((p) => {
        p[0].addEventListener("click", selectSecondFunction);
        p[0].removeEventListener("click", showMovesFunction);
        p[0].removeEventListener("click", reversePiecesFunction);
    })
    P2.forEach((p) => {
        p[0].addEventListener("click", selectSecondFunction);
        p[0].removeEventListener("click", showMovesFunction);
        p[0].removeEventListener("click", reversePiecesFunction);
    })
}

/**
 * Aux function to get the gameboard
 * 
 * @returns {Array} Gameboard, 0 = empty, 1 = P1, 2 = P2, 3 = CO
 */
function getGameboard() {

    game = b.matrix()

    game.forEach((row, index) => {
        row.forEach((col, index2) => {
            switch (col) {
                case null:
                    game[index][index2] = "0";
                    break;
                case "P1":
                    game[index][index2] = "1";
                    break;
                case "P2":
                    game[index][index2] = "2";
                    break;
            }
        });
    });

    //console.log("GAMEBOARD DONE: " + game)

    return game
}
/**
 *  Get pieces possible moves
 * 
 * @param {Array} piece Piece position
 * @returns {Array} Possible moves, empty if no moves. Each move is an array of 2 positions, the first one is the piece position, the second one is the second piece position
 */
function getMoves(piece, secondPiece) {
    var posMoves = [];

    for (var i = 0; i < moves.length; i++) {

        var dir = moves[i];
        var newpos = piece;
        var secondnewpos = secondPiece;
        //console.log(`newpos: ${newpos} secondnewpos: ${secondnewpos}`);

        //Check if the piece can move in that direction
        if (
            b.cell([newpos[0] + dir[0], newpos[1] + dir[1]]).get() == null &&
            (b.cell([secondnewpos[0] + dir[0], secondnewpos[1] + dir[1]]).get() == null ||
             [secondnewpos[0] + dir[0], secondnewpos[1] + dir[1]].toString() == newpos.toString()
            ) 
        ) {
            newpos = [newpos[0] + dir[0], newpos[1] + dir[1]];
            secondnewpos = [secondnewpos[0] + dir[0], secondnewpos[1] + dir[1]];
            console.log(`2 newpos: ${newpos} secondnewpos: ${secondnewpos}`);
        }

        if (newpos !== piece) posMoves.push([newpos, secondnewpos]);
    }
    return posMoves;
}


/**
 * Check if someone has won
 *  Win conditions: 4 pieces in a row/column.
 */
function winCheck() {
    var game = getGameboard()
    var winner;
    //Check rows
    for (var i = 0; i < game.length; i++) {
        var p1 = 0;
        var p2 = 0;
        for (var j = 0; j < game[i].length; j++) {
            if (p1 == gamemode || p2 == gamemode) break;
            switch (game[i][j]) {
                case "1":
                    p1++;
                    p2=0;
                    break;
                case "2":
                    p1=0;
                    p2++;
                    break;
                default:
                    p1=0;
                    p2=0;
                    break;
            }
        }
        if (p1 == gamemode || p2 == gamemode) {
            win = true;
            winner = p1 == gamemode ? "P1" : "P2";
            document.getElementById("turn").innerHTML = `Player ${winner} has won!`;
            return;
        }
    }
    //Check columns
    if (!win) {
        for (var i = 0; i < game.length; i++) {
            var p1 = 0;
            var p2 = 0;
            var co = 0;
            for (var j = 0; j < game[i].length; j++) {
                if (p1 == gamemode || p2 == gamemode) break;
                switch (game[j][i]) {
                    case "1":
                        p1++;
                        p2=0;
                        break;
                    case "2":
                        p1=0;
                        p2++;
                        break;
                    default:
                        p1=0;
                        p2=0;
                        break;
                }
            }
            if (p1 == gamemode || p2 == gamemode) {
                win = true;
                winner = p1 == gamemode ? "P1" : "P2";
                document.getElementById("turn").innerHTML = `Player ${winner} has won!`;
                return;
            }
        }
    }
}

/**
 * Init game deleteing all rows and cols and creating a new board
 */
function initTable(size = 6) {
    
    var table = document.getElementById("game");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    b = jsboard.board({ attach: "game", size: `${size}x${size}` });
    b.cell("each").style({ width: "65px", height: "65px", background: "#C4A484" });
    started = false;
    resetBoard(true);

}

/**
 *  Get adjacent cells to a piece that are diferent from the piece
 * 
 * @param {*} piece piece object to get adjacent cells
 * @returns {Array} Array of adjacent cells
 */
function getAdjacent(piece) {
    var possible = [];

    directions.forEach((dir) => {
        var pos = piece;
        pos = [pos[0] + dir[0], pos[1] + dir[1]];
        if (b.cell(pos).get() !== null && b.cell(pos).get() !== b.cell(piece).get() && b.cell(pos).get() !== "OOB") {
            possible.push(pos);
        }
    })

    return possible;
}

//Listeners for UI buttons
document.getElementById("reset").addEventListener("click", function () { resetBoard(true); });
document.getElementById("gamemodeN").addEventListener("click", function () {
    gamemode = 4;
    resetBoard(true);
    this.disabled = true;
    document.getElementById("gamemodeI").disabled = false;

});
document.getElementById("gamemodeI").addEventListener("click", function () {
    gamemode = 6;
    resetBoard(true);
    this.disabled = true;
    document.getElementById("gamemodeN").disabled = false;
});
document.getElementById("size6").addEventListener("click", function () {
    initTable(6);
    this.disabled = true;
    document.getElementById("size8").disabled = false;
});
document.getElementById("size8").addEventListener("click", function () {
    initTable(8);
    this.disabled = true;
    document.getElementById("size6").disabled = false;
});