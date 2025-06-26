// create Pokimon class
class Pokimon {
    constructor(board, currentPosition, headSymbol, untiSpeed = 300) {
        this.board = board;
        this.current = currentPosition;
        this.headSymbol = headSymbol;
        this.untiSpeed = untiSpeed;
    }
    score = -1;
}


class MovementManager {
    //to check wither the apple is in my range or not, so i know where to move
    #checkRange(index1, index2) {
        for (let [x, y] of this.#ranges) {
            if (index1 >= x && index1 <= y) {
                if (index2 >= x && index2 <= y) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }


    //to check boarders
    #maxRightBoarder(number) {
        if (!((number + 1) % 28) && number !== 0) {
            return true;
        }
        else return false;
    }

    #maxLeftBoarder(number) {
        if (number < 0 || !(number % 28)) {
            return true;
        }
        else return false;
    }

    #maxTopBoarder(number) {
        if (number - 28 < 0) {
            return true;
        }
        else return false;
    }

    #maxBottomBoarder(number) {
        if (number + 28 > 559) {
            return true;
        }
        else return false;
    }

    constructor(pokimon) {
        this.pokimon = pokimon;
    }

    //directions
    up = false;
    right = true;
    down = false;
    left = false;
    endGame = false;

    //initiate Pokimon movement
    IMove() {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.#maxTopBoarder(this.pokimon.current)) {
                        this.pokimon.board[this.pokimon.current].textContent = "";
                        this.pokimon.board[this.pokimon.current -= 28].textContent = this.pokimon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.right) {
                    if (!this.#maxRightBoarder(this.pokimon.current)) {
                        this.pokimon.board[this.pokimon.current].textContent = "";
                        this.pokimon.board[++this.pokimon.current].textContent = this.pokimon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.left) {
                    if (!this.#maxLeftBoarder(this.pokimon.current)) {
                        this.pokimon.board[this.pokimon.current].textContent = "";
                        this.pokimon.board[--this.pokimon.current].textContent = this.pokimon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.down) {
                    if (!this.#maxBottomBoarder(this.pokimon.current)) {
                        this.pokimon.board[this.pokimon.current].textContent = "";
                        this.pokimon.board[this.pokimon.current += 28].textContent = this.pokimon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
            } catch (error) {
                clearInterval(interval);
                this.endGame = true;
                console.log(error);
            }
        }, this.pokimon.untiSpeed);
    }

    //to detect movement direction, if same range go right or left, otherwise go up or down
    IMoveTo(index = undefined) {
        if (index === undefined) {
            return;
        }
        if (this.#checkRange(index, this.pokimon.current)) {
            if (this.pokimon.current < index) {
                this.up = false;
                this.down = false;
                this.right = true;
                this.left = false;
            }
            else if (this.pokimon.current > index) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
        }
        else if (this.pokimon.current > index) {
            this.up = true;
            this.right = false;
            this.down = false;
            this.left = false;
        }
        else if (this.pokimon.current < index) {
            this.up = false;
            this.right = false;
            this.down = true;
            this.left = false;
        }
    }

    //to check wither the apple is in my range or not, so i know where to move
    #ranges = [[0, 27], [28, 55], [56, 83], [84, 111], [112, 139], [140, 167], [168, 195], [196, 223], [224, 251],
    [252, 279], [280, 307], [308, 335], [336, 363], [364, 391], [392, 419], [420, 447], [448, 475], [476, 503],
    [504, 531], [532, 559]];
}

class FoodManager {
    //to generate a random index so that put an Apple into it
    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //to check if there is any food inside the board, to avoid adding more food
    #checkFood() {
        for (let element of this.pokimon.board) {
            if (element.textContent !== "" && element.textContent !== `${this.pokimon.headSymbol}`) {
                return true;
            }
        }
        return false;
    }

    constructor(pokimon, movementManager) {
        this.pokimon = pokimon;
        this.movementManager = movementManager;
    }

    //to initiate food
    Ifood() {
        let interval = setInterval(() => {
            if (!this.#checkFood(this.pokimon.board)) {
                let rand = this.#getRandomInt(0, 559);
                this.pokimon.board[rand].textContent = "🍎";
                this.pokimon.score++;
            }
            if (this.movementManager.endGame) {
                clearInterval(interval);
            }
        }, 200);
    }
}

// initialize a snake
let cells = document.querySelectorAll(".cell");
let pk1 = new Pokimon(cells, 0, '🤪', 200);
let mManager = new MovementManager(pk1);
let fManager = new FoodManager(pk1, mManager);
let index = undefined;
mManager.IMove();
fManager.Ifood();

let interval = setInterval(() => {
    if (index === pk1.current) {
        index = undefined;
    }
    if (mManager.endGame) {
        clearInterval(interval);
    }
    mManager.IMoveTo(index);
}, pk1.untiSpeed);

//move on click functionality
cells.forEach((e) => {
    e.addEventListener('click', () => {
        index = e.dataset.index - 1;
    });
});

console.log(cell);


//note : don't forget the pause functionality, it is done when all directions are false;