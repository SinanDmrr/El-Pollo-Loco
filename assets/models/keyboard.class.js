class KeyboardKey {
    constructor() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
    }

    keyDown(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.UP = true;
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.LEFT = true;
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.DOWN = true;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.RIGHT = true;
                break;
            case " ":
                this.SPACE = true;
                break;
        }
    }

    keyUp(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.UP = false;
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.LEFT = false;
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.DOWN = false;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.RIGHT = false;
                break;
            case " ":
                this.SPACE = false;
                break;
        }
    }
}
