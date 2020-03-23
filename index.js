/**
 * Created by rpurp on 5/28/2017.
 */
const SIZE = 40;
const DEAD = false;
const ALIVE = true;
const DEAD_IMG = "white.png";
const ALIVE_IMG = "black.png";
var gameBoard;


var isAuto = false;
var automator;

function randomize() {
    gameBoard.forEach(function(row){
        row.forEach(function(cell) {
            if(Math.random() < 0.5) {
                cell.currentState = ALIVE;
                cell.image.src = ALIVE_IMG;
            } else {
                cell.currentState = DEAD;
                cell.image.src = DEAD_IMG;
            }
        });
    });
}

function toggleAuto() {
    if(isAuto === false) {
        automator = setInterval(advanceBoard, 25);
        isAuto = true;
        document.getElementById("toggle").innerHTML = "STOP!";
        document.getElementById("advance").disabled = true;
    } else {
        clearTimeout(automator);
        automator = undefined;
        isAuto = false;
        document.getElementById("toggle").innerHTML = "GOOO!";
        document.getElementById("advance").disabled = false;
    }
}



function advanceBoard() {
    var grid = gameBoard;
    calculateAll(grid)
    grid.forEach(function(row) {
        row.forEach(function(cell) {
            if(cell.currentState !== cell.futureState) {
                cell.currentState = cell.futureState;
                cell.futureState = undefined;
                if(cell.currentState === ALIVE) {
                    cell.image.src = ALIVE_IMG;
                } else {
                    cell.image.src = DEAD_IMG;
                }
            }
        })
    })
}

function calculateAll(grid) {
    for(var r = 0; r < grid.length; r++) {
        for(var c = 0; c < grid[0].length; c++) {
            calculateNext(grid, r, c);
        }
    }

}

function calculateNext(grid, row, col) {
    var numAliveCells = 0;
    var curCell = grid[row][col];
    for(var r = row - 1; r <= row + 1; r++) {
        if(grid[r] === undefined) continue;
        for(var c = col - 1; c <= col + 1; c++) {
            if(grid[r][c] === undefined)
                continue;
            if(grid[r][c].currentState === ALIVE)
                numAliveCells++;
        }
    }
    if(numAliveCells === 3)
        curCell.futureState = ALIVE;
    else if(numAliveCells === 4)
        curCell.futureState = curCell.currentState;
    else
        curCell.futureState = DEAD;
}

function setUpConwayCell(tableCell) {
    var img = document.createElement("IMG");
    img.src = DEAD_IMG;
    img.height = "15";
    img.width = "15";
    img.style.display = "block";

    var cell = {
        tableCell : tableCell,
        image : img,
        currentState : DEAD,
        futureState : undefined};

    img.onclick = function () {
        if(cell.currentState === DEAD) {
            cell.currentState = ALIVE;
            cell.image.src = ALIVE_IMG;
        } else {
            cell.currentState = DEAD;
            cell.image.src = DEAD_IMG;
        }
    };
    return cell;
}

function makeTable() {
    var table = document.createElement("TABLE");
    table.style.padding = "5px";
    table.style.borderSpacing = "5px";
    var grid = [];
    for(var i = 0; i < SIZE; i++) {
        var row = table.insertRow(i);
        grid.push([]);
        for(var j = 0; j < SIZE; j++) {
            var tableCell = row.insertCell(j);
            tableCell.style.padding = "0px";
            var conway_cell = setUpConwayCell(tableCell);
            grid[i].push(conway_cell);
            tableCell.appendChild(conway_cell.image);
        }
    }
    document.getElementById("my_table").appendChild(table);
    gameBoard = grid;
}