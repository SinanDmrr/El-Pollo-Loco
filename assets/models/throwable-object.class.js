class ThrowableObject extends MovableObject {
    broken = false;
    rotationImages = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    splashImages = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, otherDirection) {
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.rotationImages);
        this.loadImages(this.splashImages);
        this.x = x + 20;
        this.y = y + 100;
        this.height = 60;
        this.width = 60;
        this.otherDirection = otherDirection;
        this.soundManager = SoundManager.getInstance();
        this.throw();
        this.animate();
    }

    throw() {
        this.soundManager.play('throw');
        this.speedY = 20;
        this.speedX = 25;
        this.applyGravity();
        setInterval(() => {
            this.otherDirection ? this.x -= this.speedX : this.x += this.speedX;

        }, 30);
    }

    isColliding(enemy) {
        return (
            this.x + this.width > enemy.x &&
            this.x < enemy.x + enemy.width &&
            this.y + this.height > enemy.y &&
            this.y < enemy.y + enemy.height
        );
    }

    animate() {
        let rotationInterval = setInterval(() => {
            if (this.y >= 330 || this.broken) {
                this.playAnimation(this.splashImages);
                setTimeout(() => {
                    clearInterval(rotationInterval);
                }, this.splashImages.length * 100);
            } else {
                this.playAnimation(this.rotationImages);
            }
        }, 1000 / 60);
    }
}
