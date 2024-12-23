class KeyboardKey {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.space = false;
    }

    keyDown(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.up = true;
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.left = true;
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.down = true;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.right = true;
                break;
            case " ":
                this.space = true;
                break;
        }
    }

    keyUp(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.up = false;
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.left = false;
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.down = false;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.right = false;
                break;
            case " ":
                this.space = false;
                break;
        }
    }
}
