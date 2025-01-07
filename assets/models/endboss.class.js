class Endboss extends MovableObject {
    x = 1350;
    y = 150;
    width = 300;
    height = 300;
    currentImage = 0;
    energy = 100;
    isDeadStatus = false;
    isHurtStatus = false;
    currentDirection = this.randomDirection();
    lastDirectionChange = Date.now();

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

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage('assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 2;
        this.animate();
    }

    animate() {
        let animationFrameCounter = 0;
        const intervalEndboss = setInterval(() => {
            intervalIds.push(intervalEndboss);
            this.movementEndboss();
            this.handleAnimations(animationFrameCounter);
            animationFrameCounter = (animationFrameCounter > 10) ? 0 : animationFrameCounter + 1;
        }, 1000 / 60);
    }

    handleAnimations(frameCounter) {
        if (frameCounter > 10) {
            if (this.isDeadStatus) {
                this.playAnimation(this.IMAGES_DEAD);
                this.y += 80;
            } else if (this.isHurtStatus) {
                this.playAnimation(this.IMAGES_HURT);
                setTimeout(() => {
                    this.isHurtStatus = false;
                }, this.IMAGES_HURT.length * 200);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    }

    randomDirection() {
        return Math.random() > 0.5 ? 'left' : 'right';
    }

    movementEndboss() {
        this.handleDirectionChange();
        if (!this.isDeadStatus) {
            this.moveInCurrentDirection();
        }
    }

    handleDirectionChange() {
        const directionChangeInterval = 1000;
        if (Date.now() - this.lastDirectionChange > directionChangeInterval) {
            this.currentDirection = this.randomDirection();
            this.lastDirectionChange = Date.now();
        }
    }

    moveInCurrentDirection() {
        const leftLimit = 1700;
        const rightLimit = 2000;

        if (this.currentDirection === 'left') {
            this.moveLeftWithinLimit(leftLimit);
        } else if (this.currentDirection === 'right') {
            this.moveRightWithinLimit(rightLimit);
        }
    }

    moveLeftWithinLimit(leftLimit) {
        if (this.x > leftLimit) {
            this.moveLeft(this.speed);
        } else {
            this.currentDirection = 'right';
        }
    }

    moveRightWithinLimit(rightLimit) {
        if (this.x < rightLimit) {
            this.moveRight(this.speed);
        } else {
            this.currentDirection = 'left';
        }
    }
}
