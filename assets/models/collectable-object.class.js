class CollectableObject extends MovableObject {
    width = 720;
    height = 480;
    collectedCoins = 0;
    collectedBottles = 0;

    constructor(path, x, y = 300, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.path = path;
        this.loadImage(this.path);
    }
}