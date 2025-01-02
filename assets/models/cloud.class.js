class Cloud extends MovableObject {
    x;
    y = 20;
    width = 800;
    height = 250;
    speed = 0.1;
    animationInterval;

    constructor(path, x) {
        super().loadImage(path);
        this.animate();
        this.x = x;
    }

    animate() {
        this.animationInterval = setInterval(() => {
            this.moveLeft(this.speed);
        }, 1000 / 60);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}