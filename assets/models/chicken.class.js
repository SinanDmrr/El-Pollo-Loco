class Chicken extends MovableObject {
    x = 200 + Math.random() * 500; // zwischen 200 und 700 (200+500)
    y = 360;
    width = 60;
    height = 60;

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

    }
}