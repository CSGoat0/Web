// create snake class
class Snake {
    stack = [];
    constructor(current, up, right, down, left, bodySym, headSym) {
        this.current = current;
        this.up = up;
        this.right = right;
        this.left = left;
        this.down = down;
        this.bodySymbol = bodySym;
        this.headSymbol = headSym;
    }

    //initiate snake movement
    iMove(array) {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.#maxTopBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[this.current -= 28].innerHTML = this.headSymbol;
                    }
                    else clearInterval(interval);
                }
                else if (this.right) {
                    if (!this.#maxRightBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[++this.current].innerHTML = this.headSymbol;
                    }
                    else clearInterval(interval);
                }
                else if (this.left) {
                    if (!this.#maxLeftBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[--this.current].innerHTML = this.headSymbol;
                    }
                    else clearInterval(interval);
                }
                else {
                    if (!this.#maxBottomBoarder(this.current)) {
                        array[this.current].innerHTML = "";
                        array[this.current += 28].innerHTML = this.headSymbol;
                        console.log(this.current);
                    }
                    else clearInterval(interval);
                }
            } catch (error) {
                console.log(new Error(error));
                clearInterval(interval);
            }
        }, 500);
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
        if (number + 28 > 558) {
            return true;
        }
        else return false;
    }
}

// initialize a snake
let sk1 = new Snake(197, false, false, true, false, '◼', '🤪');
let cells = document.getElementsByClassName("cell");
sk1.iMove(cells);