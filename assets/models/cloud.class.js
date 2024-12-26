class Cloud extends MovableObject {
    x = -150 + Math.random() * 500;
    y = 20;
    width = 800;
    height = 250;
    speed = 0.1;

    constructor(path) {
        super().loadImage(path);
        this.animate();
    }

    animate() {
        const animateFrame = () => {
            this.moveLeft(this.speed);
            requestAnimationFrame(animateFrame);
        };
        animateFrame();
    }
}