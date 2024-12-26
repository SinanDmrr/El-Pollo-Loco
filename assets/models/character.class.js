class Character extends MovableObject {
    x = -50;
    offsetX = 20;
    y = 220;
    width = 120;
    offsetWidth = 50;
    height = 200;
    currentImage = 0;
    world;
    speed = 7;
    deadAnimation = false;
    //TODO IDLE
    idleTimer = 0;
    idleSleep = 60 * 5; // Weil 1000/60 die Intervaldauer ist wird hier mit gewährleistet das alle 5 Sekunden die Sleep Idle triggert

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

    animate() {
        setInterval(() => {
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.idleTimer = 0; //TODO IDLE
                this.jump();

            } else if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.idleTimer = 0; //TODO IDLE
                this.moveRight();
                this.otherDirection = false;
            } else if (this.world.keyboard.LEFT && this.x > this.world.level.level_begin_x) {
                this.idleTimer = 0; //TODO IDLE
                this.moveLeft();
                this.otherDirection = true;
            } else {
                this.idleTimer++; //TODO IDLE
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.world.soundManager.play('jumping');
            } else if (this.world.keyboard.RIGHT && !this.isAboveGround() || this.world.keyboard.LEFT && !this.isAboveGround()) {
                this.playAnimation(this.IMAGES_WALKING);
                this.world.soundManager.play('walking');
            }
            // TODO IDLE IMPLEMENTIERUNG WENN SPÄTER ANDERS GELÖST WIRD HIER ÄNDERN
            else {
                this.world.soundManager.stop('walking');
                this.world.soundManager.stop('jumping');
                if (this.idleTimer < this.idleSleep) {
                    this.playAnimation(this.IMAGES_IDLE);
                } else {
                    this.playAnimation(this.IMAGES_IDLE_LONG);

                }
            }
        }, 150);
    }
}