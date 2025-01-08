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
        this.speed = 3.5;
        this.animate();
    }

    /**
     * Starts the animation for the end boss by updating its movement and handling animations.
     * Updates at a rate of 60 frames per second.
     */
    animate() {
        let animationFrameCounter = 0;
        const intervalEndboss = setInterval(() => {
            intervalIds.push(intervalEndboss);
            this.movementEndboss();
            this.handleAnimations(animationFrameCounter);
            animationFrameCounter = (animationFrameCounter > 10) ? 0 : animationFrameCounter + 1;
        }, 1000 / 60);
    }

    /**
     * Handles the animations based on the frame counter.
     * Plays different animations depending on the end boss's status (dead, hurt, or walking).
     * @param {number} frameCounter - The current frame counter.
     */
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

    /**
     * Returns a random direction (either 'left' or 'right').
     * @returns {string} The random direction.
     */
    randomDirection() {
        return Math.random() > 0.5 ? 'left' : 'right';
    }

    /**
     * Manages the movement of the end boss, including direction changes.
     * The end boss moves in the current direction unless it is dead.
     */
    movementEndboss() {
        this.handleDirectionChange();
        if (!this.isDeadStatus) {
            this.moveInCurrentDirection();
        }
    }

    /**
     * Handles direction changes for the end boss based on a time interval.
     * Changes the direction to a random one if the interval has passed.
     */
    handleDirectionChange() {
        const directionChangeInterval = 500;
        if (Date.now() - this.lastDirectionChange > directionChangeInterval) {
            this.currentDirection = this.randomDirection();
            this.lastDirectionChange = Date.now();
        }
    }

    /**
     * Moves the end boss in the current direction within specified limits.
     * Changes direction if a limit is reached.
     */
    moveInCurrentDirection() {
        const leftLimit = 1500;
        const rightLimit = 2000;

        if (this.currentDirection === 'left') {
            this.moveLeftWithinLimit(leftLimit);
        } else if (this.currentDirection === 'right') {
            this.moveRightWithinLimit(rightLimit);
        }
    }

    /**
     * Moves the end boss to the left within a specified limit.
     * Changes direction to 'right' if the limit is reached.
     * @param {number} leftLimit - The left boundary limit.
     */
    moveLeftWithinLimit(leftLimit) {
        if (this.x > leftLimit) {
            this.moveLeft(this.speed);
        } else {
            this.currentDirection = 'right';
        }
    }

    /**
     * Moves the end boss to the right within a specified limit.
     * Changes direction to 'left' if the limit is reached.
     * @param {number} rightLimit - The right boundary limit.
     */
    moveRightWithinLimit(rightLimit) {
        if (this.x < rightLimit) {
            this.moveRight(this.speed);
        } else {
            this.currentDirection = 'left';
        }
    }
}
