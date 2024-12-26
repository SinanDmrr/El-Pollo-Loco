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

    drawCollisonBorder(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';

            if (this instanceof Character) {
                ctx.rect(this.x + this.offsetX, this.y, this.width - this.offsetWidth, this.height);
            } else {
                ctx.rect(this.x, this.y, this.width, this.height);
            }
            ctx.stroke();
        }
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
        return this.y < 220
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