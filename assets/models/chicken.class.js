class Chicken extends MovableObject {
    x = 200 + Math.random() * 500; // zwischen 200 und 700 (200+500)
    y = 360;
    width = 60;
    height = 60;
    currentImage = 0;

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING)
        this.speed = 0.15 + Math.random() * 1
        this.animate();

    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
        this.moveLeft(this.speed);
    }
}