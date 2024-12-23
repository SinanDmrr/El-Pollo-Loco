class Character extends MovableObject {
    x = 50;
    y = 220;
    width = 120;
    height = 200;
    currentImage = 0;
    world;
    speed = 14;

    IMAGES_WALKING = [
        'assets/img/2_walk/W-21.png',
        'assets/img/2_walk/W-22.png',
        'assets/img/2_walk/W-23.png',
        'assets/img/2_walk/W-24.png',
        'assets/img/2_walk/W-25.png',
        'assets/img/2_walk/W-26.png'
    ];
    imgJumpingCharacter = [
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
    imgHurtCharacter = [
        'assets/img/4_hurt/H-41.png',
        'assets/img/4_hurt/H-42.png',
        'assets/img/4_hurt/H-43.png'
    ];
    imgDeadCharacter = [
        'assets/img/5_dead/D-51.png',
        'assets/img/5_dead/D-52.png',
        'assets/img/5_dead/D-53.png',
        'assets/img/5_dead/D-54.png',
        'assets/img/5_dead/D-55.png',
        'assets/img/5_dead/D-56.png',
        'assets/img/5_dead/D-57.png'
    ];

    constructor() {
        super().loadImage('assets/img/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                this.world.soundManager.play('walking');
            } else if (this.world.keyboard.LEFT && this.x > this.world.level.level_begin_x) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.world.soundManager.play('walking');
            } else {
                this.world.soundManager.stop('walking');
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    jump() {
        console.log('Jumping');
    }
}