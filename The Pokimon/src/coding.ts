// create pokemon class
class Pokemon {
    board: NodeList;
    current: number;
    headSymbol: string;
    antiSpeed: number;
    constructor(board: NodeList, currentPosition: number, headSymbol: string, untiSpeed = 300) {
        this.board = board;
        this.current = currentPosition;
        this.headSymbol = headSymbol;
        this.antiSpeed = untiSpeed;
    }
    score = -1;
    endGame = false;
}


class MovementManager {
    //to check wither the apple is in my range or not, so i know where to move
    protected checkRange(index1: number, index2: number): boolean {
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
    protected maxRightBoarder(number: number): boolean {
        if (!((number + 1) % 28) && number !== 0) {
            return true;
        }
        else return false;
    }

    protected maxLeftBoarder(number: number): boolean {
        if (number < 0 || !(number % 28)) {
            return true;
        }
        else return false;
    }

    protected maxTopBoarder(number: number): boolean {
        if (number - 28 < 0) {
            return true;
        }
        else return false;
    }

    protected maxBottomBoarder(number: number): boolean {
        if (number + 28 > 559) {
            return true;
        }
        else return false;
    }

    pokemon: Pokemon;
    constructor(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    //directions
    up = false;
    right = true;
    down = false;
    left = false;

    //initiate pokemon movement
    IMove() {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.maxTopBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[this.pokemon.current -= 28].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.pokemon.endGame = true;
                    };
                }
                else if (this.right) {
                    if (!this.maxRightBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[++this.pokemon.current].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.pokemon.endGame = true;
                    };
                }
                else if (this.left) {
                    if (!this.maxLeftBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[--this.pokemon.current].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.pokemon.endGame = true;
                    };
                }
                else if (this.down) {
                    if (!this.maxBottomBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[this.pokemon.current += 28].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval)
                        this.pokemon.endGame = true;
                    };
                }
                if (this.pokemon.endGame) {
                    clearInterval(interval);
                }
            } catch (error) {
                clearInterval(interval);
                this.pokemon.endGame = true;
                console.log(error);
            }
        }, this.pokemon.antiSpeed);
    }

    //to detect movement direction, if same range go right or left, otherwise go up or down
    IMoveTo(index: number | undefined = undefined) {
        if (index === undefined) {
            return;
        }
        if (this.checkRange(index, this.pokemon.current)) {
            if (this.pokemon.current < index) {
                this.up = false;
                this.down = false;
                this.right = true;
                this.left = false;
            }
            else if (this.pokemon.current > index) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
        }
        else if (this.pokemon.current > index) {
            this.up = true;
            this.right = false;
            this.down = false;
            this.left = false;
        }
        else if (this.pokemon.current < index) {
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

class Ghost extends MovementManager {
    target: Pokemon;
    constructor(pokemon: Pokemon, target: Pokemon) {
        super(pokemon);
        this.target = target
    }
    generateMovement() {
        interval = setInterval(() => {
            let rand = getRandomInt(1, 4);
            if (rand === 1) {
                this.up = false;
                this.right = true;
                this.down = false;
                this.left = false;
            }
            else if (rand === 2) {
                this.up = false;
                this.right = false;
                this.down = true;
                this.left = false;
            }
            else if (rand === 3) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
            //rand === 4
            else {
                this.up = true;
                this.right = false;
                this.down = false;
                this.left = false;
            }
        }, 800);
    }

    override IMove() {
        let interval = setInterval(() => {
            try {
                const currentCell = this.pokemon.board[this.pokemon.current];
                if (currentCell.textContent?.includes(this.pokemon.headSymbol)) {
                    currentCell.textContent = currentCell.textContent.replace(this.pokemon.headSymbol, '');
                }
                if (this.up && !this.maxTopBoarder(this.pokemon.current)) {
                    this.pokemon.current -= 28;
                }
                else if (this.right && !this.maxRightBoarder(this.pokemon.current)) {
                    this.pokemon.current++;
                }
                else if (this.left && !this.maxLeftBoarder(this.pokemon.current)) {
                    this.pokemon.current--;
                }
                else if (this.down && !this.maxBottomBoarder(this.pokemon.current)) {
                    this.pokemon.current += 28;
                }
                else {
                    if (this.maxTopBoarder(this.pokemon.current) && this.up) {
                        this.pokemon.current += 532;
                    }
                    else if (this.maxRightBoarder(this.pokemon.current) && this.right) {
                        this.pokemon.current -= 27;
                    }
                    else if (this.maxBottomBoarder(this.pokemon.current) && this.down) {
                        this.pokemon.current -= 532;
                    }
                    else if (this.maxLeftBoarder(this.pokemon.current) && this.left) {
                        this.pokemon.current += 27;
                    }
                }
                if (this.target.endGame) {
                    clearInterval(interval);
                }

                // Add head symbol to new cell (without removing existing content)
                const newCell = this.pokemon.board[this.pokemon.current];
                newCell.textContent = (newCell.textContent || '') + this.pokemon.headSymbol;

            } catch (error) {
                clearInterval(interval);
                this.pokemon.endGame = true;
                console.log(error);
            }
        }, this.pokemon.antiSpeed);

        let loseCheck = setInterval(() => {
            const currentCell = this.pokemon.board[this.pokemon.current];
            if (currentCell.textContent?.includes(this.target.headSymbol)) {
                this.target.endGame = true;
            }
            if (this.target.endGame) {
                clearInterval(loseCheck);
            }
        }, 100);
    }
}

class FoodManager {
    food = new Set([
        '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
        '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
        '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅',
        '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚',
        '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴',
        '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯',
        '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱',
        '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
        '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂',
        '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
        '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺',
        '🍻', '🥂', '🍷', '🍸', '🍹', '🍾', '🧊', '🥄', '🍴',
        '🍽️', '🥣', '🥡', '🥢', '🧂'
    ]);

    #checkFood() {
        for (let element of this.pokemon.board) {
            if (element.textContent &&
                [...element.textContent].some(char => this.food.has(char))) {
                return true;
            }
        }
        return false;
    }

    pokemon: Pokemon;
    constructor(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    #foodSymbol = "🍎";

    setSymbol(food: string) {
        for (let element of this.pokemon.board) {
            if (element.textContent === this.#foodSymbol) {
                element.textContent = food;
            }
        }
        this.#foodSymbol = food;
    }

    //to initiate food
    Ifood() {
        let interval = setInterval(() => {
            if (!this.#checkFood()) {
                let rand = getRandomInt(0, 559);
                this.pokemon.board[rand].textContent = this.#foodSymbol;
                this.pokemon.score++;
            }
            if (this.pokemon.endGame) {
                clearInterval(interval);
            };
        }, 200);
    }
}

// initialize a snake
let cells = document.querySelectorAll(".cell") as NodeListOf<HTMLElement>;
let pk1 = new Pokemon(cells, 0, '🤪', 200);
let mManager = new MovementManager(pk1);
let fManager = new FoodManager(pk1);
let index: number | undefined = undefined;
mManager.IMove();
fManager.Ifood();

let interval = setInterval(() => {
    if (index === pk1.current) {
        index = undefined;
    }
    if (pk1.endGame) {
        clearInterval(interval);
    }
    mManager.IMoveTo(index);
}, pk1.antiSpeed);

//move on click functionality
cells.forEach((e) => {
    e.addEventListener('click', () => {
        index = Number(e.dataset.index) - 1;
    });
});

//generate random number
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//timer functionality
let timerElement = document.getElementById("timer") as HTMLElement;
let hours = 0, minutes = 0, seconds = 0;
let timerInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    if (pk1.endGame) {
        clearInterval(timerInterval);
    }
    timerElement.textContent = `Time: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, 1000);

//score functionality
let score = document.getElementById("score") as HTMLElement;
let scoreInterval = setInterval(() => {
    score.textContent = `Score: ${pk1.score}`;
    if (pk1.endGame) {
        clearInterval(timerInterval);
    }
}, 200);

//Restart Functionality
let resBtn = document.getElementById("restart") as HTMLElement;
resBtn.onclick = () => {
    history.go(0);
}

//Ghost Functionality
const ghostFaces = [
    '😡', '🤬', '🥵', '🥶', '😱', '🤢', '😈',
    '👿', '👹', '👺', '🤡', '👻', '💀', '☠️',
    '👽', '👾', '🤖', '🎃'];
let ghostBtn = document.getElementById("add-ghost") as HTMLElement;
let diffRange = document.getElementById("range") as HTMLInputElement;
ghostBtn.onclick = () => {
    let ghost = new Pokemon(cells, getRandomInt(0, 559), ghostFaces[getRandomInt(0, 17)], 1000 - Number(diffRange.value));
    let ghostMove = new Ghost(ghost, pk1);
    ghostMove.IMove();
    ghostMove.generateMovement();
}
//adding faces and foods to select list
const faces = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
    '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
    '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
    '🤖', '🎃'
];
const food = [
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
    '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
    '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅',
    '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚',
    '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴',
    '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯',
    '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱',
    '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
    '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂',
    '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
    '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺',
    '🍻', '🥂', '🍷', '🍸', '🍹', '🍾', '🧊', '🥄', '🍴',
    '🍽️', '🥣', '🥡', '🥢', '🧂'
];

let pokemon = document.getElementById("pokemon") as HTMLSelectElement;
let foods = document.getElementById("food") as HTMLSelectElement;

faces.forEach(emoji => {
    const option = new Option(emoji, emoji);
    pokemon.add(option);
});

food.forEach(emoji => {
    const option = new Option(emoji, emoji);
    foods.add(option);
});

pokemon.addEventListener('change', () => {
    pk1.headSymbol = pokemon.value;
});
foods.addEventListener('change', () => {
    fManager.setSymbol(foods.value);
});

//rules button
let rules = document.getElementById("rules") as HTMLElement;
rules.onclick = () => {
    location.replace("rules.html");
}

//on lose function
function onLose() {
    let defeat = document.getElementById("defeat") as HTMLElement;
    defeat.style.visibility = "visible";
    let gameWindow = document.getElementById("game-board") as HTMLElement;
    let currentOpacity = parseFloat(gameWindow.style.opacity) || 1;
    let interval = setInterval(() => {
        currentOpacity -= 0.1;
        gameWindow.style.opacity = String(currentOpacity);
        if (currentOpacity <= 0) {
            gameWindow.style.opacity = '0';
            clearInterval(interval);
            gameWindow.innerHTML = "";
            let otherInterval = setInterval(() => {
                currentOpacity += 0.1;
                gameWindow.style.opacity = String(currentOpacity);
                if (currentOpacity >= 1) {
                    gameWindow.style.opacity = '1';
                    clearInterval(otherInterval);
                    windowRebuild();
                }
            }, 50);
        }
    }, 120);
}

function windowRebuild() {
    let gameWindow = document.getElementById("game-board") as HTMLElement;
    gameWindow.innerHTML = `
    <div class="rebuilt-cell" data-index="1"></div>
    <div class="rebuilt-cell" data-index="2"></div>
    <div class="rebuilt-cell" data-index="3"></div>
    <div class="rebuilt-cell" data-index="4"></div>
    <div class="rebuilt-cell" data-index="5"></div>
    <div class="rebuilt-cell" data-index="6"></div>
    <div class="rebuilt-cell" data-index="7"></div>
    <div class="rebuilt-cell" data-index="8"></div>
    <div class="rebuilt-cell" data-index="9"></div>
    `
    gameWindow.style = `
        display: flex;
        flex-direction: row;
        flew-wrap: wrap;
        justify-content: center;
        text-align: center;
        align-content: center;
    `

    gameWindow.children[6].textContent = pk1.headSymbol;
    gameWindow.children[2].textContent = "🤜";
    let index = 2;
    let adder = 1;

    let interval = setInterval(() => {
        gameWindow.children[index].innerHTML = "";
        if (index <= 1 || index >= 5) {
            adder *= -1;
        }
        index += adder;
        gameWindow.children[index].textContent = "🤜";
        if (index === 5) {
            setTimeout(() => {
                gameWindow.children[6].textContent = "";
                pk1.headSymbol = faces[getRandomInt(0, 101)];
                gameWindow.children[7].textContent = pk1.headSymbol;
            }, 100)
        }
        else {
            setTimeout(() => {
                gameWindow.children[6].textContent = pk1.headSymbol;
                gameWindow.children[7].textContent = "";
            }, 100)
        }
    }, 200);
}

let loseInterval = setInterval(() => {
    if (pk1.endGame) {
        onLose();
        clearInterval(loseInterval);
    }
});