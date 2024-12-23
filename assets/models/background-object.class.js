class BackgroundObject extends MovableObject {
    x = 0;
    y = 0;
    width = 720;
    height = 480;

    constructor(path, x = 0, y = 0) {
        super().loadImage(path);
        this.x = x;
        this.y = y;
    }
}