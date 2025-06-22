// create snake class
class Snake {
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

    #checkFood(container) {
        for (let element of container) {
            if (element.textContent !== "" && element.textContent !== `${this.headSymbol}`) {
                return true;
            }
        }
        return false;
    }

    constructor(current, up, right, down, left, headSym, untiSpeed = 400) {
        this.current = current;
        this.up = up;
        this.right = right;
        this.left = left;
        this.down = down;
        this.headSymbol = headSym;
        this.untiSpeed = untiSpeed;
    }

    score = -1;
    endGame = false;
    #ranges = [[0, 27], [28, 55], [56, 83], [85, 111], [112, 139], [140, 167], [168, 195], [196, 223], [224, 251],
    [216, 279], [280, 307], [308, 335], [336, 363], [364, 391], [392, 419], [420, 447], [448, 475], [476, 503],
    [504, 531], [532, 559]];

    //initiate snake movement
    IMove(array) {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.#maxTopBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[this.current -= 28].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.right) {
                    if (!this.#maxRightBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[++this.current].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else if (this.left) {
                    if (!this.#maxLeftBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[--this.current].innerHTML = this.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.endGame = true;
                    };
                }
                else {
                    if (!this.#maxBottomBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[this.current += 28].innerHTML = this.headSymbol;
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

    Ifood(container) {
        let interval = setInterval(() => {
            if (!this.#checkFood(container)) {
                let rand = this.#getRandomInt(0, 559);
                container[rand].textContent = "🍎";
                this.score++;
                this.untiSpeed -= 100;
            }
            if (this.endGame) {
                clearInterval(interval);
            }
        }, 100);
    }
}

// initialize a snake
let sk1 = new Snake(350, false, false, true, false, '🤪', 120);
let cells = document.querySelectorAll(".cell");
let index = undefined;
sk1.IMove(cells);
sk1.Ifood(cells);

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
