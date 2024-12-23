class Cloud extends MovableObject {
    x = -150 + Math.random() * 500;
    y = 20;
    width = 800;
    height = 250;

    constructor(path) {
        super().loadImage(path);
    };
}
