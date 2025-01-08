class EnemyManager {
    constructor(level, character, soundManager, healthBar, bossHealthBar, coinBar, bottleBar) {
        this.level = level;
        this.character = character;
        this.soundManager = soundManager;
        this.healthBar = healthBar;
        this.bossHealthBar = bossHealthBar;
        this.coinBar = coinBar;
        this.bottleBar = bottleBar;
    }

    /**
     * Spawns a random number (1-2) of chickens near the character's position.
     * Each chicken is assigned a unique ID and added to the list of enemies in the level.
     */
    spawnChickens() {
        const numberOfChickens = Math.floor(Math.random() * 2) + 1;
        const baseSpawnX = this.character.x + 800;
        for (let i = 0; i < numberOfChickens; i++) {
            const newChicken = new Chicken();
            newChicken.x = baseSpawnX + i * 100;
            newChicken.id = crypto.randomUUID();
            this.level.enemies.push(newChicken);
        }
    }

    /**
     * Spawns an endboss at a specific position relative to the character
     * and initializes its health bar and status in the game.
     * Plays a sound when spawning the endboss if music is not paused.
     * 
     * @param {boolean} musicPaused - Indicates whether the background music is paused.
     */
    spawnEndboss(musicPaused) {
        const spawnX = this.character.x + 600;
        const newEndboss = new Endboss();
        newEndboss.x = spawnX;
        this.level.bossHealthBar = new Statusbar('boss', 5, 500);
        this.level.world.bossSpawned = true;
        this.level.enemies.push(newEndboss);

        if (!musicPaused) {
            this.soundManager.play('boss_chicken_start');
            setTimeout(() => {
                this.soundManager.stop('boss_chicken_start');
            }, 800);
        }
    }

    /**
     * Checks for collisions between the character and enemies.
     * Handles specific scenarios like killing chickens when colliding from the top
     * or applying damage to the character on general collisions.
     * 
     * @param {boolean} musicPaused - Indicates whether the background music is paused.
     */
    checkCollisions(musicPaused) {
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDeadStatus) return;
            if (this.character.isCollidingFromTop(enemy) && enemy instanceof Chicken) {
                this.handleChickenDeath(enemy);
                return;
            }
            if (!this.character.isDead() && this.character.isColliding(enemy)) {
                this.handleCharacterHit(enemy, musicPaused);
            }
        });
    }

    /**
     * Handles the death of a chicken by updating its image, marking it as dead,
     * and removing it from the list of enemies after a delay.
     * 
     * @param {Object} enemy - The chicken object to handle upon death.
     */
    handleChickenDeath(enemy) {
        enemy.img = enemy.IMAGE_DEAD;
        enemy.loadImage(enemy.IMAGE_DEAD);
        enemy.isDeadStatus = true;
        this.soundManager.stop('chicken');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id);
        }, 500);
    }

    /**
     * Handles the character being hit by an enemy.
     * Reduces the character's energy based on the enemy type and updates the health bar.
     * Ends the game if the character's energy reaches zero.
     * 
     * @param {Object} enemy - The enemy object that hit the character.
     */
    handleCharacterHit(enemy, musicPaused) {
        if (enemy instanceof Endboss) {
            this.character.hit(40);
        } else {
            this.character.hit(20);
        }
        this.healthBar.setPercentage(this.character.energy);
        musicPaused ? this.soundManager.stop('hurt') : this.soundManager.play('hurt');
        // this.soundManager.play('hurt');
        if (this.character.isDead() && !this.level.gameOver) {
            setTimeout(() => {
                this.level.world.gameOver = true;
                this.level.world.gameRunning = false;
            }, 1000);
        }
    }
}
