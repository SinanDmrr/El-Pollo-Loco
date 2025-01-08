class UIManager {
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
        this.canvas = world.canvas;
        this.images = world.images;
    }

    /**
     * Preloads images for UI icons and stores them in the `images` object for later use.
     */
    preloadImages() {
        const iconPaths = {
            home: 'assets/img/10_icons/home.png',
            instruction: 'assets/img/10_icons/instruction.png',
            play: 'assets/img/10_icons/play.png',
            music: 'assets/img/10_icons/music.png',
        };
        for (const [name, path] of Object.entries(iconPaths)) {
            const img = new Image();
            img.src = path;
            this.images[name] = img;
        }
    }

    /**
     * Draws the background, UI elements, and any active health bars on the canvas.
     */
    drawBackgroundAndUI() {
        this.ctx.translate(this.world.camera_x, 0);
        this.world.addObjectsToMap(this.world.level.backgroundObjects);
        this.world.addObjectsToMap(this.world.level.clouds);
        this.ctx.translate(-this.world.camera_x, 0);
        this.world.addToMap(this.world.healthBar);
        this.world.addToMap(this.world.coinBar);
        this.world.addToMap(this.world.bottleBar);
        if (this.world.bossSpawned) this.world.addToMap(this.world.bossHealthBar);
    }

    /**
     * Draws the foreground objects including enemies, the character, collectables, and throwable objects.
     */
    drawForeground() {
        this.ctx.translate(this.world.camera_x, 0);
        this.world.addObjectsToMap(this.world.level.enemies);
        this.world.addToMap(this.world.character);
        this.world.addObjectsToMap(this.world.level.collectables);
        this.world.addObjectsToMap(this.world.throwableObject);
        this.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Combines drawing of the background, UI elements, and foreground objects.
     */
    drawBackgroundAndObjects() {
        this.drawBackgroundAndUI();
        this.drawForeground();
    }

    /**
     * Displays the win screen with a victory image and screen icons.
     * Plays or stops the victory sound depending on the music state.
     */
    drawWinScreen() {
        let winImage = new Image();
        winImage.src = "assets/img/9_intro_outro_screens/win/win_2.png";
        winImage.onload = () => {
            this.ctx.drawImage(winImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.world.soundManager.stop('backgroundmusic');
        this.world.musicPaused ? this.world.soundManager.stop('game_win') : this.world.soundManager.play('game_win');
    }

    /**
     * Displays the game over screen with a corresponding image and screen icons.
     * Stops all background music and plays the game over sound if music is enabled.
     */
    drawGameOverScreen() {
        let gameOverImage = new Image();
        gameOverImage.src = "assets/img/9_intro_outro_screens/game_over/game over.png";
        gameOverImage.onload = () => {
            this.ctx.drawImage(gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.world.soundManager.stopAll();
        this.world.musicPaused ? this.world.soundManager.stop('game_lose') : this.world.soundManager.play('game_lose');
    }

    /**
     * Displays the start screen with an image and associated icons.
     */
    drawStartScreen() {
        let startScreenImage = new Image();
        startScreenImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
        startScreenImage.onload = () => {
            this.ctx.drawImage(startScreenImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
    }

    /**
     * Draws icons on the screen based on the current game state (e.g., game over, running, paused).
     */
    drawScreenIcons() {
        let icons;
        if (this.world.gameOver || this.world.endbossDefeated) {
            icons = [{ img: this.images.home, x: 720 / 2 - 25, y: 50 }];
        } else if (!this.world.gameRunning) {
            icons = [
                { img: this.images.instruction, x: 0 + 25, y: 50 },
                { img: this.images.play, x: 720 / 2 - 25, y: 50 }
            ];
        } else if (this.world.gameRunning) {
            icons = [{ img: this.images.music, x: 720 / 2 - 25, y: 50 }];
        }
        this.iconsStyling(icons);
    }

    /**
     * Applies styling and positioning for the given screen icons and draws them on the canvas.
     * 
     * @param {Array} icons - List of icon objects containing image and position data.
     */
    iconsStyling(icons) {
        icons.forEach(icon => {
            this.circleStyling(icon);
            this.ctx.drawImage(icon.img, icon.x, icon.y, 40, 40);
        });
    }

    /**
     * Styles the circular background for an icon and draws it on the canvas.
     * 
     * @param {Object} icon - The icon object containing its position data.
     */
    circleStyling(icon) {
        this.ctx.beginPath();
        this.ctx.arc(icon.x + 20, icon.y + 20, 32, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(icon.x + 20, icon.y + 20, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'orange';
        this.ctx.fill();
        this.ctx.closePath();
    }

    /**
     * Displays the instructions screen if the `showInstruction` flag is true.
     * Otherwise, it draws the game elements on the canvas.
     */
    showInstructions() {
        if (this.world.showInstruction) {
            const introJump = 'W, ↑ - Jump';
            const introLeft = 'A, ← - Move to Left';
            const introRight = 'D, → - Move to Right';
            const introThrow = 'SPACE - Throw a Bottle';
            this.instructionBackground(introJump, introLeft, introRight, introThrow);
        } else {
            this.world.draw();
        }
    }

    /**
     * Draws the background for the instructions screen and renders the instructions text.
     * 
     * @param {string} introJump - Instruction text for the jump action.
     * @param {string} introLeft - Instruction text for moving left.
     * @param {string} introRight - Instruction text for moving right.
     * @param {string} introThrow - Instruction text for throwing a bottle.
     */
    instructionBackground(introJump, introLeft, introRight, introThrow) {
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
        this.ctx.fillRect(this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(introJump, this.canvas.width / 2, this.canvas.height / 2 - 25);
        this.ctx.fillText(introLeft, this.canvas.width / 2, this.canvas.height / 2 - 0);
        this.ctx.fillText(introRight, this.canvas.width / 2, this.canvas.height / 2 - (-25));
        this.ctx.fillText(introThrow, this.canvas.width / 2, this.canvas.height / 2 - (-50));
    }
}