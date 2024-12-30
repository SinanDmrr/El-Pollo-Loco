class Chicken extends MovableObject {
    x = 100 + Math.random() * 1200;
    y = 360;
    width = 60;
    height = 60;
    currentImage = 0;
    speed = 1;
    isDeadStatus = false;

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = 'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING)
        this.loadImage(this.IMAGE_DEAD);
        this.speed = this.speed + Math.random() * 2
        this.animate();
    }

    animate() {
        let animationFrameCounter = 0;

        const intervalChicken = setInterval(() => {
            if (!this.isDeadStatus) {
                intervalIds.push(intervalChicken);
                this.moveLeft(this.speed);

                animationFrameCounter++;

                if (animationFrameCounter > 11) {
                    this.playAnimation(this.IMAGES_WALKING);
                    animationFrameCounter = 0;
                }
            } else {
                clearInterval(intervalChicken);
            }
        }, 1000 / 60);
    }
}