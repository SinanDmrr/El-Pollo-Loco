class Character extends MovableObject {
    x = -1000;
    offsetX = 25;
    y = 220;
    width = 100;
    offsetWidth = 50;
    height = 200;
    currentImage = 0;
    world;
    speed = 5;
    deadAnimation = false;
    idleTimer = 0;
    idleSleep = 60 * 5;
    collectedCoins = 0;
    collectedBottles = 0;
    hurtSoundPlayed = false;

    IMAGES_WALKING = [
        'assets/img/2_walk/W-21.png',
        'assets/img/2_walk/W-22.png',
        'assets/img/2_walk/W-23.png',
        'assets/img/2_walk/W-24.png',
        'assets/img/2_walk/W-25.png',
        'assets/img/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'assets/img/3_jump/J-31.png',
        'assets/img/3_jump/J-32.png',
        'assets/img/3_jump/J-33.png',
        'assets/img/3_jump/J-34.png',
        'assets/img/3_jump/J-35.png',
        'assets/img/3_jump/J-36.png',
        'assets/img/3_jump/J-37.png',
        'assets/img/3_jump/J-38.png',
        'assets/img/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'assets/img/4_hurt/H-41.png',
        'assets/img/4_hurt/H-42.png',
        'assets/img/4_hurt/H-43.png'
    ];
    IMAGES_DEAD = [
        'assets/img/5_dead/D-51.png',
        'assets/img/5_dead/D-52.png',
        'assets/img/5_dead/D-53.png',
        'assets/img/5_dead/D-54.png',
        'assets/img/5_dead/D-55.png',
        'assets/img/5_dead/D-56.png',
        'assets/img/5_dead/D-57.png'
    ];
    IMAGES_IDLE = [
        'assets/img/1_idle/idle/I-1.png',
        'assets/img/1_idle/idle/I-2.png',
        'assets/img/1_idle/idle/I-3.png',
        'assets/img/1_idle/idle/I-4.png',
        'assets/img/1_idle/idle/I-5.png',
        'assets/img/1_idle/idle/I-6.png',
        'assets/img/1_idle/idle/I-7.png',
        'assets/img/1_idle/idle/I-8.png',
        'assets/img/1_idle/idle/I-9.png',
        'assets/img/1_idle/idle/I-10.png'
    ]
    IMAGES_IDLE_LONG = [
        'assets/img/1_idle/long_idle/I-11.png',
        'assets/img/1_idle/long_idle/I-12.png',
        'assets/img/1_idle/long_idle/I-13.png',
        'assets/img/1_idle/long_idle/I-14.png',
        'assets/img/1_idle/long_idle/I-15.png',
        'assets/img/1_idle/long_idle/I-16.png',
        'assets/img/1_idle/long_idle/I-17.png',
        'assets/img/1_idle/long_idle/I-18.png',
        'assets/img/1_idle/long_idle/I-19.png',
        'assets/img/1_idle/long_idle/I-20.png'
    ]

    constructor() {
        super().loadImage('assets/img/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();
    }

    /**
     * Handles the movement and animation of the character by updating intervals for movement and animation.
    * Checks the game's state to handle appropriate movement and camera positioning.
    */
    animate() {
        const intervalMove = setInterval(() => {
            intervalIds.push(intervalMove);
            if (this.world.gameRunning) {
                this.handleMovement();
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);

        const intervalAnimate = setInterval(() => {
            intervalIds.push(intervalAnimate);
            if (this.world.gameRunning) {
                this.handleAnimations();
            }
        }, 150);
    }

    /**
    * Handles character movement based on keyboard input.
    * Moves the character up, left, or right, or increments idle time if no input is given.
    */
    handleMovement() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.idleTimer = 0;
            this.jump();
        } else if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.idleTimer = 0;
            this.moveRight();
            this.otherDirection = false;
        } else if (this.world.keyboard.LEFT && this.x > this.world.level.level_begin_x) {
            this.idleTimer = 0;
            this.moveLeft();
            this.otherDirection = true;
        } else {
            this.idleTimer++;
        }
    }

    /**
     * Handles the character's animation based on the current state.
     * Plays the appropriate animation depending on whether the character is dead, hurt, jumping, walking, or idle.
     */
    handleAnimations() {
        if (this.isDead() && !this.deadAnimation) {
            this.deadAnimation = true;
            this.playDeadAnimation();
        } else if (this.isHurt()) {
            this.handleHurtAnimation();
        } else if (this.isAboveGround()) {
            this.handleJumpingAnimation();
        } else if (this.isWalking()) {
            this.handleWalkingAnimation();
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Plays the hurt animation and resets the idle timer.
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.idleTimer = 0;
    }

    /**
     * Plays the jumping animation and manages the jumping sound.
     */
    handleJumpingAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.world.musicPaused ? this.world.soundManager.stop('jumping') : this.world.soundManager.play('jumping');
    }

    /**
     * Plays the walking animation and manages the walking sound.
    */
    handleWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
        this.world.musicPaused ? this.world.soundManager.stop('walking') : this.world.soundManager.play('walking');
    }

    /**
     * Plays the idle animation based on the idle timer, switching to a long idle animation after a certain time.
     * Stops any walking or jumping sounds.
     */
    handleIdleAnimation() {
        this.world.soundManager.stop('walking');
        this.world.soundManager.stop('jumping');
        if (this.idleTimer < this.idleSleep) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE_LONG);
        }
    }

    /**
     * Checks if the character is currently walking based on keyboard input.
     * @returns {boolean} - True if the character is walking, otherwise false.
     */
    isWalking() {
        return this.world.keyboard.RIGHT && !this.isAboveGround() || this.world.keyboard.LEFT && !this.isAboveGround();
    }

    /**
     * Plays the dead animation and stops all intervals while doing so.
     */
    playDeadAnimation() {
        this.clearAllIntervals();
        let index = 0;
        const interval = setInterval(() => {
            if (index < this.IMAGES_DEAD.length) {
                this.img = this.imgCache[this.IMAGES_DEAD[index]];
                index++;
            } else {
                clearInterval(interval);
            }
        }, 150);
    }
}