class Reset {
    constructor(world) {
        this.world = world;  // Zugriff auf die gesamte World-Instanz
    }

    /**
     * Resets the game state to its initial conditions, including game status, character state, status bars, and level elements.
     * Also ensures the game drawing is updated accordingly.
     */
    resetGame() {
        this.resetGameStatus();
        this.resetCharacter();
        this.resetStatusBars();
        this.resetLevel();
        this.musicPaused = false;
        this.world.draw();
    }

    /**
     * Resets the overall game status flags to their initial state.
     */
    resetGameStatus() {
        this.world.gameRunning = false;
        this.world.gameOver = false;
        this.world.endbossDefeated = false;
        this.world.bossSpawned = false;
    }

    /**
     * Resets the character's state, including position, energy, animations, and timers.
     */
    resetCharacter() {
        this.world.character.deadAnimation = false;
        this.world.character.energy = 100;
        this.world.character.x = -1000;
        this.world.character.y = 220;
        this.world.character.idleTimer = 0;
        this.world.character.clearAllIntervals();
        this.world.character.loadImage('assets/img/2_walk/W-21.png');
        this.world.character.animate();
    }

    /**
     * Resets the status bars for health, coins, and bottles to their initial values.
     */
    resetStatusBars() {
        this.world.healthBar.setPercentage(100);
        this.world.coinBar.setPercentage(0);
        this.world.bottleBar.setPercentage(0);
        this.world.bottleCount = 0;
    }

    /**
     * Clears all level-related elements, such as enemies, collectables, and throwable objects.
     */
    resetLevel() {
        this.world.throwableObject = [];
        this.world.level.enemies = [];
        this.world.level.collectables = [];
    }
}
