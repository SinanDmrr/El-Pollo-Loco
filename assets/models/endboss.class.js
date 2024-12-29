class Endboss extends MovableObject {
    x = 1550;
    y = 150;
    width = 300;
    height = 300;
    currentImage = 0;

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor() {
        super().loadImage('assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.speed = 1;
        this.animate();
    }

    animate() {
        let animationFrameCounter = 0;
        let directionChangeInterval = 2000;
        let currentDirection = this.randomDirection();
        let lastDirectionChange = Date.now();

        const intervalEndboss = setInterval(() => {
            intervalIds.push(intervalEndboss);

            if (Date.now() - lastDirectionChange > directionChangeInterval) {
                currentDirection = this.randomDirection();
                lastDirectionChange = Date.now();
            }

            if (currentDirection === 'left') {
                if (this.x > 1420) {
                    this.moveLeft(this.speed);
                } else {
                    currentDirection = 'right';
                }
            } else {
                if (this.x < 1750) {
                    this.moveRight(this.speed);
                } else {
                    currentDirection = 'left';
                }
            }

            animationFrameCounter++;

            if (animationFrameCounter > 16) {
                this.playAnimation(this.IMAGES_WALKING);
                animationFrameCounter = 0;
            }
        }, 1000 / 60);
    }

    randomDirection() {
        return Math.random() > 0.5 ? 'left' : 'right';
    }


}
