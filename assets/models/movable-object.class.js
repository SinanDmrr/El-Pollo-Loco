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

    isCollidingFromTop(mo) {
        // Berechnung der Grenzen des aktuellen Charakters
        const characterLeft = this.x + this.offsetX;
        const characterRight = characterLeft + (this.width - this.offsetWidth);
        const characterTop = this.y;
        const characterBottom = this.y + this.height;

        // Berechnung der Grenzen des kollidierenden Objekts (mo)
        const moLeft = mo.x;
        const moRight = mo.x + mo.width;
        const moTop = mo.y;

        // Überprüfen, ob die Kollision von oben kommt
        return (
            characterRight > moLeft &&
            characterLeft < moRight &&
            characterBottom > moTop &&
            characterTop < moTop &&
            characterBottom < 420 // Bedingung für den Boden
        );
    }

    isColliding(mo) {
        const characterLeft = this.x + this.offsetX;
        const characterRight = characterLeft + (this.width - this.offsetWidth);
        const characterTop = this.y;
        const characterBottom = this.y + this.height;

        const moLeft = mo.x;
        const moRight = mo.x + mo.width;
        const moTop = mo.y;
        const moBottom = mo.y + mo.height;

        return (
            characterRight > moLeft &&
            characterLeft < moRight &&
            characterBottom > moTop &&
            characterTop < moBottom
        );
    }

    hit(dmg) {
        if (this.energy <= 0) {
            this.energy = 0;
        } else if (!this.isHurt()) {
            this.timeAtLastHit = new Date().getTime();
            this.energy -= dmg;
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.timeAtLastHit;
        timePassed = timePassed / 1000;
        return timePassed < 2;
    }

    isDead() {
        return this.energy <= 0;
    }

    clearAllIntervals() {
        for (let i = 1; i < 1000; i++) window.clearInterval(i);
    }
}