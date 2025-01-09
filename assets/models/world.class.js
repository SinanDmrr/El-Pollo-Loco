class World {
    healthBar = new Statusbar();
    bossHealthBar = new Statusbar('boss', 5, 500);
    coinBar = new Statusbar('coin', 40);
    bottleBar = new Statusbar('bottle', 80);
    character = new Character();
    throwableObject = [];
    bottleCount = 0;
    gameRunning = false;
    gameOver = false;
    endbossSpwaned = false;
    endbossDefeated = false;
    showInstruction = false;
    level = level1;
    camera_x = -100;
    lastCollectableSpawnX;

    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.soundManager = new SoundManager(this);
        this.canvas = canvas
        this.images = {};
        this.level.world = this;
        this.uiManager = new UIManager(this);
        this.uiManager.preloadImages();
        this.draw();
        this.setWorld();
        this.soundManager.loadStartSounds();
        this.enemyManager = new EnemyManager(this.level, this.character, this.soundManager, this.healthBar, this.bossHealthBar, this.coinBar, this.bottleBar);
        this.run();
        this.canvasClickListener();
        this.musicPaused = localStorage.getItem('musicPaused') === 'true';
        this.uiManager.drawScreenIcons();
        this.resetWorld = new Reset(this);
    }

    /**
     * Renders the game screen based on the current game state.
     * - Displays the "Game Over" screen if the game is over.
     * - Displays the "Win" screen if the end boss is defeated.
     * - Displays the "Start" screen if the game is not running.
     * - Otherwise, updates and redraws the game objects and background.
     */
    draw() {
        if (this.gameOver) {
            this.uiManager.drawGameOverScreen();
        } else if (this.endbossDefeated) {
            this.uiManager.drawWinScreen();
        } else if (!this.gameRunning) {
            this.uiManager.drawStartScreen();
        } else if (this.gameRunning) {
            this.soundManager.checkMusic(this.musicPaused);
            this.uiManager.drawBackgroundAndObjects();
            this.uiManager.drawScreenIcons();
            this.animationFrameId = requestAnimationFrame(() => {
                this.draw();
            });
        }
    }

    /**
     * Toggles the music pause state and updates localStorage.
     */
    pauseMusic() {
        if (!this.musicPaused) {
            this.musicPaused = true;
        } else {
            this.musicPaused = false;
        }
        localStorage.setItem('musicPaused', this.musicPaused);
    }

    /**
     * Initializes the click listener for the canvas and handles icon clicks.
     */
    canvasClickListener() {
        this.canvas.style.cursor = 'default';
        this.mouseOverEventListener();

        this.canvas.addEventListener('click', (event) => {
            const { x: clickX, y: clickY } = this.getMousePosition(event);
            const icons = this.getIcons();
            const clickedIcon = icons.find(icon => this.isHovering(clickX, clickY, icon));

            if (clickedIcon) {
                this.handleIconClick(clickedIcon);
            }
        });
    }

    /**
     * Handles the logic for clicking different icons.
     * @param {Object} icon - The clicked icon object.
     */
    handleIconClick(icon) {
        switch (icon.name) {
            case 'home':
                this.resetWorld.resetGame();
                this.soundManager.stop('game_lose');
                this.soundManager.stop('game_win');
                this.soundManager.stop('chicken');
                break;
            case 'play':
                this.resetWorld.resetGame();
                this.soundManager.stop('game_lose');
                this.soundManager.stop('game_win');
                this.soundManager.stop('chicken');
                this.gameRunning = true;
                this.draw();
                this.spawnChicken();
                this.spawnInitialCollectables();
                break;
            case 'fullscreen':
                this.toggleFullscreen(this.canvas);
                break;
            case 'instruction':
                this.showInstruction = !this.showInstruction;
                this.uiManager.showInstructions();
                break;
            case 'music':
                this.pauseMusic();
                break;
        }
    }

    /**
     * Calculates the mouse position relative to the canvas scale.
     * @param {MouseEvent} event - The mouse event.
     * @returns {Object} The mouse position with `x` and `y` properties.
     */
    getMousePosition(event) {
        const scaleX = this.canvas.width / this.canvas.offsetWidth;
        const scaleY = this.canvas.height / this.canvas.offsetHeight;
        return {
            x: event.offsetX * scaleX,
            y: event.offsetY * scaleY
        };
    }

    /**
     * Returns a list of interactive icons based on the game state.
     * @returns {Array} An array of icon objects.
     */
    getIcons() {
        let icons = [];
        if (this.gameOver || this.endbossDefeated) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'home' });
            icons = [
                { x: 720 / 2, y: 50 + 25, radius: 32, name: 'home' },
                { x: 920 / 2, y: 50 + 25, radius: 32, name: 'play' }
            ];
        } else if (!this.gameRunning) {
            icons = [
                { x: 50, y: 50 + 25, radius: 32, name: 'instruction' },
                { x: 720 / 2, y: 50 + 25, radius: 32, name: 'play' }
            ];
        } else if (this.gameRunning) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'music' });
        }
        return icons;
    }

    /**
     * Checks if the mouse is hovering over a given icon.
     * @param {number} mouseX - The mouse X-coordinate.
     * @param {number} mouseY - The mouse Y-coordinate.
     * @param {Object} icon - The icon to check.
     * @returns {boolean} True if the mouse is hovering over the icon, false otherwise.
     */
    isHovering(mouseX, mouseY, icon) {
        const distance = Math.sqrt((mouseX - icon.x) ** 2 + (mouseY - icon.y) ** 2);
        return distance <= icon.radius;
    }

    /**
     * Checks if the mouse is hovering over any of the provided icons.
     * @param {Array} icons - The list of icons.
     * @param {number} mouseX - The mouse X-coordinate.
     * @param {number} mouseY - The mouse Y-coordinate.
     * @returns {boolean} True if hovering over any icon, false otherwise.
     */
    checkHovering(icons, mouseX, mouseY) {
        for (const icon of icons) {
            if (this.isHovering(mouseX, mouseY, icon)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a mousemove event listener to handle cursor changes on hover.
     */
    mouseOverEventListener() {
        this.canvas.addEventListener('mousemove', (event) => {
            const { x: mouseX, y: mouseY } = this.getMousePosition(event);
            const icons = this.getIcons();
            const isHovering = this.checkHovering(icons, mouseX, mouseY);
            this.canvas.style.cursor = isHovering ? 'pointer' : 'default';
        });
    }

    /**
     * Sets the world for the character, assigning the current world to the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the game loop for checking collisions, throwable objects, and collectables spawn.
     * The loop runs every 100ms.
     */
    run() {
        setInterval(() => {
            this.enemyManager.checkCollisions(this.musicPaused);
            this.checkThrowObjects();
            this.checkForCollectableSpawn();
            this.checkCollectableCollisions();
        }, 100)
    }

    /**
     * Spawns chickens or the endboss at a set interval.
     * Stops spawning when the character is dead or when the endboss is spawned.
     */
    spawnChicken() {
        const spawnInterval = setInterval(() => {
            if (this.character.isDead()) {
                clearInterval(spawnInterval);
                return;
            }

            if (this.character.x >= 1300 && !this.bossSpawned) {
                this.enemyManager.spawnEndboss(this.musicPaused);
                clearInterval(spawnInterval);
                return;
            }

            this.enemyManager.spawnChickens();
        }, 1000);
    }

    /**
     * Spawns the initial collectables after the character starts moving.
     */
    spawnInitialCollectables() {
        this.lastCollectableSpawnX = this.character.x + 100;
        this.spawnCollectablesAtPosition(this.lastCollectableSpawnX);
    }

    /**
     * Spawns collectables at a specific position.
     * Collectables include coins and a salsa bottle.
     * 
     * @param {number} x - The x-coordinate where collectables will be spawned.
     */
    spawnCollectablesAtPosition(x) {
        const baseX = x;
        const baseY = 300;
        const gap = 50;

        const collectables = [
            new CollectableObject('assets/img/8_coin/coin_1.png', baseX, baseY, 100, 100),
            new CollectableObject('assets/img/8_coin/coin_1.png', baseX + gap, baseY, 100, 100),
            new CollectableObject('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png', baseX + gap * 2.3, baseY, 70, 70),
            new CollectableObject('assets/img/8_coin/coin_1.png', baseX + gap * 3, baseY, 100, 100),
            new CollectableObject('assets/img/8_coin/coin_1.png', baseX + gap * 4, baseY, 100, 100),
        ];
        this.level.collectables.push(...collectables);
    }

    /**
     * Checks if new collectables need to be spawned based on the character's position.
     */
    checkForCollectableSpawn() {
        if (this.character.x > this.lastCollectableSpawnX && this.lastCollectableSpawnX <= 1500) {
            this.lastCollectableSpawnX += 650;
            this.spawnCollectablesAtPosition(this.lastCollectableSpawnX);
        }
    }

    /**
     * Checks for collisions between the character and collectables.
     * Updates the coin and bottle count based on the collectables collected.
     */
    checkCollectableCollisions() {
        this.level.collectables.forEach((collectable, index) => {
            if (this.character.isColliding(collectable)) {
                if (collectable.path.includes('coin')) {
                    this.coinBar.setPercentage(this.coinBar.percentage + 5);
                } else if (collectable.path.includes('bottle')) {
                    this.bottleCount = (this.bottleCount || 0) + 2;
                    this.bottleBar.setPercentage(this.bottleBar.percentage + 20);
                }
                this.level.collectables.splice(index, 1);
            }
        });
    }

    /**
     * Checks for objects that can be thrown, such as bottles.
     * It also checks for bottle collisions with enemies.
     */
    checkThrowObjects() {
        this.throwBottle();
        this.checkBottleCollisions();
    }

    /**
     * Throws a bottle if the player presses the spacebar and has bottles available.
     */
    throwBottle() {
        if (this.keyboard.SPACE && this.throwableObject.length === 0 && !world.character.isDead()) {
            if (this.bottleCount > 0) {
                this.createThrowableBottle();
                this.updateBottleCount();
                this.playThrowSound();
            }
        }
    }

    /**
     * Creates a throwable bottle object and adds it to the throwable objects array.
     */
    createThrowableBottle() {
        let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection);
        this.throwableObject.push(bottle);
    }

    /**
     * Updates the bottle count and handles the bottle usage.
     * Reduces the bottle count by 1 and updates the bottle bar.
     */
    updateBottleCount() {
        this.bottleCount--;
        this.throwCount = (this.throwCount || 0) + 1;

        if (this.throwCount >= 2) {
            this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
            this.throwCount = 0;
        }
    }

    /**
     * Plays or stops the sound for throwing a bottle based on the current music state.
     */
    playThrowSound() {
        this.musicPaused ? this.soundManager.stop('throw') : this.soundManager.play('throw');
    }

    /**
     * Checks if thrown bottles are out of bounds or collided with enemies.
     * Removes bottles that are out of bounds or broken.
     */
    checkBottleCollisions() {
        this.throwableObject.forEach((bottle, index) => {
            if (this.isBottleOutOfBounds(bottle)) {
                this.removeBottle(index);
                return;
            }
            this.checkEnemyCollisions(bottle);
        });
    }

    /**
     * Determines if a thrown bottle is out of bounds or broken.
     * 
     * @param {ThrowableObject} bottle - The bottle to check.
     * @returns {boolean} - Returns true if the bottle is out of bounds or broken.
     */
    isBottleOutOfBounds(bottle) {
        return bottle.y >= 380 || bottle.broken;
    }

    /**
     * Removes a thrown bottle from the throwable objects array.
     * 
     * @param {number} index - The index of the bottle to remove.
     */
    removeBottle(index) {
        this.throwableObject.splice(index, 1);
    }

    /**
     * Checks if a thrown bottle collides with any enemies.
     * Handles the hit logic for both regular enemies and the endboss.
     * 
     * @param {ThrowableObject} bottle - The thrown bottle to check for collisions.
     */
    checkEnemyCollisions(bottle) {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !enemy.isDeadStatus) {
                bottle.broken = true;
                if (enemy instanceof Endboss) {
                    this.handleEndbossHit(enemy);
                } else {
                    this.handleEnemyHit(enemy);
                }
            }
        });
    }

    /**
     * Handles the logic when the endboss is hit by a thrown bottle.
     * Applies damage and checks if the endboss is dead.
     * 
     * @param {Endboss} enemy - The endboss being hit.
     */
    handleEndbossHit(enemy) {
        this.applyDamageToEndboss(enemy);
        if (enemy.isDead()) {
            this.handleEndbossDeath(enemy);
        }
        this.bossHealthBar.setPercentage(enemy.energy);
    }

    /**
     * Applies damage to the endboss and triggers hurt status if energy is above 20.
     * 
     * @param {Endboss} enemy - The endboss to apply damage to.
     */
    applyDamageToEndboss(enemy) {
        enemy.hit(20);
        enemy.isHurtStatus = true;
        if (enemy.energy >= 20) {
            this.playEndbossSound();
        }
    }

    /**
     * Plays or stops the sound for the endboss depending on the current music state.
     */
    playEndbossSound() {
        if (this.musicPaused) {
            this.soundManager.stop('boss_chicken_start');
        } else {
            this.soundManager.play('boss_chicken_start');
            setTimeout(() => {
                this.soundManager.stop('boss_chicken_start');
            }, 300);
        }
    }

    /**
     * Handles the logic when the endboss dies.
     * Removes the endboss from the level and updates the game state.
     * 
     * @param {Endboss} enemy - The endboss that died.
     */
    handleEndbossDeath(enemy) {
        enemy.isDeadStatus = true;
        this.musicPaused ? this.soundManager.stop('boss_chicken_start') : this.soundManager.play('boss_chicken_start');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id);
            this.bossSpawned = false;
            this.endbossDefeated = true;
            this.uiManager.drawScreenIcons();
        }, enemy.IMAGES_DEAD.length * 300);
    }

    /**
     * Handles the logic when a regular enemy is hit by a thrown bottle.
     * Removes the enemy from the level.
     * 
     * @param {Enemy} enemy - The enemy that was hit.
     */
    handleEnemyHit(enemy) {
        this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id);
    }

    /**
     * Adds a map object to the game map and draws it.
     * If the object has a "otherDirection" flag, the image is flipped before drawing.
     * 
     * @param {Object} mo - The map object to add to the map.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }

    };

    /**
     * Adds a list of objects to the map and draws each of them.
     * 
     * @param {Array} objects - An array of objects to add to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        })
    }

    /**
     * Flips the image horizontally by changing the canvas context.
     * 
     * @param {Object} mo - The map object whose image should be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1
    }

    /**
     * Restores the canvas context after flipping an image.
     * 
     * @param {Object} mo - The map object whose image flip should be reverted.
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1
    }
}