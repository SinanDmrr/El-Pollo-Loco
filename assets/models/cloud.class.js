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

    /**
     * Starts the animation by moving the object to the left at a specified speed.
     * The movement is updated at a rate of 60 frames per second.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.moveLeft(this.speed);
        }, 1000 / 60);
    }

    /**
     * Stops the animation by clearing the interval if it exists.
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}