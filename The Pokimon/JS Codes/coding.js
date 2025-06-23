// create snake class
class Pokimon {
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

    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #checkFood() {
        for (let element of this.board) {
            if (element.textContent !== "" && element.textContent !== `${this.headSymbol}`) {
                return true;
            }
        }
        return false;
    }

    constructor(board, currentPosition, headSymbol, bodySymbol, untiSpeed = 1000) {
        this.board = board;
        this.current = currentPosition;
        this.headSymbol = headSymbol;
        this.bodySymbol = bodySymbol;
        this.untiSpeed = untiSpeed;
    }

    up = false;
    right = true;
    down = false;
    left = false;
    score = -1;
    endGame = false;

    //to check wither the apple is in my range or not, so i know where to move
    #ranges = [[0, 27], [28, 55], [56, 83], [85, 111], [112, 139], [140, 167], [168, 195], [196, 223], [224, 251],
    [216, 279], [280, 307], [308, 335], [336, 363], [364, 391], [392, 419], [420, 447], [448, 475], [476, 503],
    [504, 531], [532, 559]];

    //initiate snake movement
    IMove() {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.#maxTopBoarder(this.current)) {
                        this.board[this.current].innerHTML = "";
                        this.board[this.current -= 28].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.right) {
                    if (!this.#maxRightBoarder(this.current)) {
                        this.board[this.current].innerHTML = "";
                        this.board[++this.current].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.left) {
                    if (!this.#maxLeftBoarder(this.current)) {
                        this.board[this.current].innerHTML = "";
                        this.board[--this.current].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else {
                    if (!this.#maxBottomBoarder(this.current)) {
                        this.board[this.current].innerHTML = "";
                        this.board[this.current += 28].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
            } catch (error) {
                clearInterval(interval);
                this.endGame = true;
                console.log(new Error(error));
            }
        }, this.untiSpeed);
    }

    IMoveTo(index = undefined) {
        if (index === undefined) {
            return;
        }
        if (this.#checkRange(index, this.current)) {
            if (this.current < index) {
                this.up = false;
                this.right = true;
                this.down = false;
                this.left = false;
            }
            else if (this.current > index) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
        }
        else if (this.current > index) {
            this.up = true;
            this.right = false;
            this.down = false;
            this.left = false;
        }
        else if (this.current < index) {
            this.up = false;
            this.right = false;
            this.down = true;
            this.left = false;
        }
    }

    Ifood() {
        let interval = setInterval(() => {
            if (!this.#checkFood(this.board)) {
                let rand = this.#getRandomInt(0, 559);
                this.board[rand].textContent = "🍎";
                this.score++;
                this.untiSpeed -= 100;
            }
            if (this.endGame) {
                clearInterval(interval);
            }
        }, 200);
    }
}

// initialize a snake
let cells = document.querySelectorAll(".cell");
let sk1 = new Pokimon(cells, 350, '🤪', '⚫', 250);
let index = undefined;
sk1.IMove();
sk1.Ifood();

setInterval(() => {
    if (index === sk1.current) {
        index = undefined;
    }
    sk1.IMoveTo(index);
}, 100);

//move on click functionality
let interval;
cells.forEach((e) => {
    e.addEventListener('click', () => {
        index = e.dataset.index - 1;
    });
});
