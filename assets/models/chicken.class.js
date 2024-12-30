class Chicken extends MovableObject {
    x = 100 + Math.random() * 1200;
    y = 360;
    width = 60;
    height = 60;
    currentImage = 0;
    speed = 1;

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING)
        this.speed = this.speed + Math.random() * 2
        this.animate();
    }

    animate() {
        let animationFrameCounter = 0;

        const intervalChicken = setInterval(() => {
            intervalIds.push(intervalChicken);
            this.moveLeft(this.speed);

            animationFrameCounter++;

            if (animationFrameCounter > 11) {
                this.playAnimation(this.IMAGES_WALKING);
                animationFrameCounter = 0;
            }
        }, 1000 / 60);
    }
}