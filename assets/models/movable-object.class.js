class MovableObject extends DrawableObject {
    speed = 0.15
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    timeAtLastHit = 0;
    isAboveChicken = false;

    /**
 * Plays an animation by cycling through an array of images.
 * @param {string[]} images - The array of image paths to cycle through.
 */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by increasing its x coordinate by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by decreasing its x coordinate by its speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Applies gravity to the object by decreasing its y coordinate over time.
     * Continues to apply gravity as long as the object is above the ground or moving upwards.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if the object is above the ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 220;
        }
    }

    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 19;
    }

    /**
     * Checks if the object is colliding with another object from the top.
     * @param {Object} mo - The other object to check collision with.
     * @returns {boolean} True if colliding from the top, false otherwise.
     */
    isCollidingFromTop(mo) {
        const characterLeft = this.x + this.offsetX;
        const characterRight = characterLeft + (this.width - this.offsetWidth);
        const characterTop = this.y;
        const characterBottom = this.y + this.height;
        const moLeft = mo.x + 10;
        const moRight = mo.x + mo.width;
        const moTop = mo.y;

        return (
            this.isAboveGround() &&
            this.speedY < 0 &&
            characterRight > moLeft &&
            characterLeft < moRight &&
            characterBottom > moTop &&
            characterTop < moTop &&
            this.y < mo.y
        );
    }

    /**
     * Checks if the object is colliding with another object.
     * @param {Object} mo - The other object to check collision with.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(mo) {
        const moLeft = mo.x;
        const moRight = mo.x + mo.width;
        const moTop = mo.y;
        const moBottom = mo.y + mo.height;
        const characterLeft = this.x + this.offsetX;
        const characterRight = characterLeft + (this.width - this.offsetWidth);
        const characterTop = this.y;
        const characterBottom = this.y + this.height;
        return (
            characterRight > moLeft &&
            characterLeft < moRight &&
            characterBottom > moTop &&
            characterTop < moBottom
        );
    }

    /**
     * Reduces the object's energy by the given damage amount.
     * If the object is a character and is not already hurt, it sets the time of the last hit.
     * @param {number} dmg - The amount of damage to inflict.
     */
    hit(dmg) {
        if (this.energy <= 0) {
            this.energy = 0;
        } else if (this instanceof Character) {
            if (!this.isHurt()) {
                this.timeAtLastHit = new Date().getTime();
                this.energy -= dmg;
                this.hurtSoundPlayed = true;
            }
        } else {
            this.energy -= dmg;
        }
    }

    /**
     * Checks if the object is currently hurt.
     * @returns {boolean} True if the object was hurt within the last 2 seconds, false otherwise.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.timeAtLastHit;
        timePassed = timePassed / 1000;
        return timePassed < 2;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if the object's energy is zero or less, false otherwise.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Clears all active intervals stored in the intervalIds array.
     */
    clearAllIntervals() {
        intervalIds.forEach(id => clearInterval(id));
        intervalIds = [];
    }
}