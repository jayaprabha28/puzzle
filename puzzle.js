var rows = 3;
var columns = 3;

var currTile;
var otherTile; // blank tile

var turns = 0;
var maxTurns = 20;

// imgOrder should include the blank tile represented by "9"
var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
var correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./sliding-puzzles/" + imgOrder.shift() + ".jpg"; // Adjusted path if needed

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); // click an image to drag
            tile.addEventListener("dragover", dragOver); // moving image around while clicked
            tile.addEventListener("dragenter", dragEnter); // dragging image onto another one
            tile.addEventListener("dragleave", dragLeave); // dragged image leaving another image
            tile.addEventListener("drop", dragDrop); // drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd); // after drag drop, swap the two tiles

            document.getElementById("board").append(tile);
        }
    }
}

function dragStart() {
    if (turns >= maxTurns) {
        document.getElementById("message").innerText = "No more moves allowed!";
        return;
    }
    currTile = this; // this refers to the img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
    otherTile = this; // this refers to the img tile being dropped on
}

function dragEnd() {
    // Ensure that we only allow swaps with the blank tile (9.jpg in this case)
    if (!otherTile.src.includes("9.jpg") || turns >= maxTurns) {
        return;
    }

    let currCoords = currTile.id.split("-"); // ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;

    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;

        if (checkWin()) {
            document.getElementById("message").innerText = "Congratulations, you win!";
            disableTiles();
        } else if (turns >= maxTurns) {
            document.getElementById("message").innerText = "No more moves allowed!";
        }
    }
}

function checkWin() {
    let tiles = document.getElementById("board").getElementsByTagName("img");
    for (let i = 0; i < tiles.length; i++) {
        if (!tiles[i].src.includes(correctOrder[i] + ".jpg")) {
            return false;
        }
    }
    return true;
}

function disableTiles() {
    let tiles = document.getElementById("board").getElementsByTagName("img");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].removeEventListener("dragstart", dragStart);
        tiles[i].removeEventListener("dragover", dragOver);
        tiles[i].removeEventListener("dragenter", dragEnter);
        tiles[i].removeEventListener("dragleave", dragLeave);
        tiles[i].removeEventListener("drop", dragDrop);
        tiles[i].removeEventListener("dragend", dragEnd);
    }
}
