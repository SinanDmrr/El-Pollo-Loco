class MovableObject extends DrawableObject {
    speed = 0.15
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    timeAtLastHit = 0;

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 30)
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 220
        }
    }

    jump() {
        this.speedY = 19;
    }

    isColliding(mo) {
        return (this.x + this.offsetX) + (this.width - this.offsetWidth) >= mo.x &&
            this.y + this.height >= mo.y &&
            this.x <= mo.x &&
            this.y <= mo.y + mo.height
    }

    hit(dmg) {
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.timeAtLastHit = new Date().getTime();
            if (this.isHurt()) {
                this.energy -= dmg;
            }
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.timeAtLastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }
}