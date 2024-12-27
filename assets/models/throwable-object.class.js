class ThrowableObject extends MovableObject {
    // soundManager = new SoundManager();
    constructor(x, y) {
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = x + 20;
        this.y = y + 100;
        this.height = 60;
        this.width = 60;
        this.soundManager = SoundManager.getInstance();
        this.throw();
    }

    throw() {
        this.soundManager.play('throw');
        this.speedY = 10;
        this.speedX = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += this.speedX
        }, 30);
    }
}