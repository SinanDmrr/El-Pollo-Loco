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
        this.soundManager = soundManager;
        this.canvas = canvas
        this.draw();
        this.setWorld();
        this.run();
        this.loadSound();
        this.canvasClickListener();
        this.musicIconImage = this.character.loadImage('assets/img/10_icons/music.png');
        this.musicPaused = false;
        this.drawScreenIcons();
    }

    resetGame() {
        this.resetGameStatus();
        this.resetCharacter();
        this.resetStatusBars();
        this.resetLevel();
        this.musicPaused = false;
        this.draw();
    }

    resetGameStatus() {
        this.gameRunning = false;
        this.gameOver = false;
        this.endbossDefeated = false;
        this.bossSpawned = false;
    }

    resetCharacter() {
        this.character.deadAnimation = false;
        this.character.energy = 100;
        this.character.x = -1000;
        this.character.y = 220;
        this.character.idleTimer = 0;
        this.character.clearAllIntervals();
        this.character.loadImage('assets/img/2_walk/W-21.png');
        this.character.animate();
    }

    resetStatusBars() {
        this.healthBar.setPercentage(100);
        this.coinBar.setPercentage(0);
        this.bottleBar.setPercentage(0);
        this.bottleCount = 0;
    }

    resetLevel() {
        this.throwableObject = [];
        this.level.enemies = [];
        this.level.collectables = [];
    }

    pauseMusic() {
        if (!this.musicPaused) {
            this.musicPaused = true;
        } else {
            this.musicPaused = false;
        }
    }

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

    handleIconClick(icon) {
        switch (icon.name) {
            case 'home':
                this.resetGame();
                this.soundManager.stop('game_lose');
                this.soundManager.stop('game_win');
                this.soundManager.stop('chicken');
                break;
            case 'play':
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
                this.showInstructions();
                break;
            case 'music':
                this.pauseMusic();
                break;
        }
    }

    getMousePosition(event) {
        const scaleX = this.canvas.width / this.canvas.offsetWidth;
        const scaleY = this.canvas.height / this.canvas.offsetHeight;
        return {
            x: event.offsetX * scaleX,
            y: event.offsetY * scaleY
        };
    }

    getIcons() {
        let icons = [];
        if (this.gameOver || this.endbossDefeated) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'home' });
        } else if (!this.gameRunning) {
            icons = [
                { x: 50, y: 50 + 25, radius: 32, name: 'instruction' },
                { x: 720 / 2, y: 50 + 25, radius: 32, name: 'play' },
                { x: 720 - 50, y: 50 + 25, radius: 32, name: 'fullscreen' }
            ];
        } else if (this.gameRunning) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'music' });
        }
        return icons;
    }

    isHovering(mouseX, mouseY, icon) {
        const distance = Math.sqrt((mouseX - icon.x) ** 2 + (mouseY - icon.y) ** 2);
        return distance <= icon.radius;
    }

    checkHovering(icons, mouseX, mouseY) {
        for (const icon of icons) {
            if (this.isHovering(mouseX, mouseY, icon)) {
                return true;
            }
        }
        return false;
    }

    mouseOverEventListener() {
        this.canvas.addEventListener('mousemove', (event) => {
            const { x: mouseX, y: mouseY } = this.getMousePosition(event);
            const icons = this.getIcons();
            const isHovering = this.checkHovering(icons, mouseX, mouseY);
            this.canvas.style.cursor = isHovering ? 'pointer' : 'default';
        });
    }

    draw() {
        if (this.gameOver) {
            this.drawGameOverScreen();
        } else if (this.endbossDefeated) {
            this.drawWinScreen();
        } else if (!this.gameRunning) {
            this.drawStartScreen();
        } else if (this.gameRunning) {
            this.checkMusic();
            this.drawBackgroundAndObjects()
            this.drawScreenIcons();
            this.animationFrameId = requestAnimationFrame(() => {
                this.draw();
            });
        }
    }

    drawBackgroundAndUI() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.bossSpawned) this.addToMap(this.bossHealthBar);
    }

    drawForeground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectables);
        this.addObjectsToMap(this.throwableObject);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawBackgroundAndObjects() {
        this.drawBackgroundAndUI();
        this.drawForeground();
    }

    drawWinScreen() {
        let winImage = new Image();
        winImage.src = "assets/img/9_intro_outro_screens/win/win_2.png";
        winImage.onload = () => {
            this.ctx.drawImage(winImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.soundManager.stop('backgroundmusic');
        this.musicPaused ? this.soundManager.stop('game_win') : this.soundManager.play('game_win');
    }

    drawGameOverScreen() {
        let gameOverImage = new Image();
        gameOverImage.src = "assets/img/9_intro_outro_screens/game_over/game over.png";
        gameOverImage.onload = () => {
            this.ctx.drawImage(gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.soundManager.stopAll();
        this.musicPaused ? this.soundManager.stop('game_lose') : this.soundManager.play('game_lose');
    }

    drawStartScreen() {
        let startScreenImage = new Image();
        startScreenImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
        startScreenImage.onload = () => {
            this.ctx.drawImage(startScreenImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
    }

    checkMusic() {
        if (this.musicPaused) {
            this.soundManager.stop('backgroundmusic');
            this.soundManager.loop('backgroundmusic', false);
            this.soundManager.stop('chicken')
        } else {
            this.soundManager.play('backgroundmusic');
            this.soundManager.loop('backgroundmusic', true);
            this.soundManager.play('chicken');
        }
    }

    drawScreenIcons() {
        let icons;
        if (this.gameOver || this.endbossDefeated) {
            icons = [{ src: 'assets/img/10_icons/home.png', x: 720 / 2 - 25, y: 50 }];
        } else if (!this.gameRunning) {
            icons = [
                { src: 'assets/img/10_icons/instruction.png', x: 0 + 25, y: 50 },
                { src: 'assets/img/10_icons/play.png', x: 720 / 2 - 25, y: 50 },
                { src: 'assets/img/10_icons/fullscreen.png', x: 720 - 75, y: 50 }
            ];
        } else if (this.gameRunning) {
            icons = [{ src: 'assets/img/10_icons/music.png', x: 720 / 2 - 25, y: 50 }];
        }
        this.iconsStyling(icons);
    }

    iconsStyling(icons) {
        icons.forEach(icon => {
            this.circleStyling(icon);
            let iconImage = new Image();
            iconImage.src = icon.src;
            if (this.gameRunning) {
                this.ctx.drawImage(iconImage, icon.x, icon.y, 40, 40);
            } else {
                iconImage.onload = () => {
                    this.ctx.drawImage(iconImage, icon.x, icon.y, 40, 40);
                };
            }
        });
    }

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

    showInstructions() {
        if (this.showInstruction) {
            const introJump = 'W, ↑ - Jump';
            const introLeft = 'A, ← - Move to Left';
            const introRight = 'D, → - Move to Right';
            const introThrow = 'SPACE - Throw a Bottle';
            this.instructionBackground(introJump, introLeft, introRight, introThrow);
        } else {
            this.draw();
        }
    }

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

    toggleFullscreen(canvas) {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().then(() => {
                canvas.width = this.window.innerWidth;
                canvas.height = this.window.innerHeight;
            }).catch(err => {
                console.error(`Fullscreen-Fehler: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen().then(() => {
                canvas.width = 720;
                canvas.height = 480;
                this.draw();
            });
        }
    }

    loadSound() {
        this.soundManager.loadSound('walking', 'assets/sounds/walking.mp3');
        this.soundManager.setVolume('walking', 0.08);
        this.soundManager.loadSound('hurt', 'assets/sounds/hurt.mp3');
        this.soundManager.setVolume('hurt', 0.08);
        this.soundManager.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.soundManager.setVolume('jumping', 0.005);
        this.soundManager.loadSound('throw', 'assets/sounds/throw.mp3');
        this.soundManager.setVolume('throw', 0.3);
        this.soundManager.loadSound('backgroundmusic', 'assets/sounds/background_music.mp3');
        this.soundManager.setVolume('backgroundmusic', 0.02);
        this.soundManager.loadSound('chicken', 'assets/sounds/chicken.mp3');
        this.soundManager.loadSound('game_win', 'assets/sounds/game_win.mp3');
        this.soundManager.loadSound('game_lose', 'assets/sounds/game_lose.mp3');
        this.soundManager.loadSound('boss_chicken_start', 'assets/sounds/boss_chicken_start.mp3');
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkForCollectableSpawn();
            this.checkCollectableCollisions();
        }, 100)
    }

    spawnChicken() {
        const spawnInterval = setInterval(() => {
            if (this.character.isDead()) {
                clearInterval(spawnInterval);
                return;
            }

            if (this.character.x >= 1300 && !this.bossSpawned) {
                this.spawnEndboss();
                clearInterval(spawnInterval);
                return;
            }

            this.spawnChickens();
        }, 1000);
    }

    spawnEndboss() {
        const spawnX = this.character.x + 600;
        const newEndboss = new Endboss();
        if (this.musicPaused) {
            this.soundManager.stop('boss_chicken_start');
        } else {
            this.soundManager.play('boss_chicken_start');
            setTimeout(() => {
                this.soundManager.stop('boss_chicken_start');
            }, 800);
        }
        newEndboss.x = spawnX;
        this.bossHealthBar = new Statusbar('boss', 5, 500);
        this.bossSpawned = true;
        this.level.enemies.push(newEndboss);
    }

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

    spawnInitialCollectables() {
        this.lastCollectableSpawnX = this.character.x + 100;
        this.spawnCollectablesAtPosition(this.lastCollectableSpawnX);
    }

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

    checkForCollectableSpawn() {
        if (this.character.x > this.lastCollectableSpawnX && this.lastCollectableSpawnX <= 1500) {
            this.lastCollectableSpawnX += 650;
            this.spawnCollectablesAtPosition(this.lastCollectableSpawnX);
        }
    }

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

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDeadStatus) return;
            if (this.character.isCollidingFromTop(enemy) && enemy instanceof Chicken) {
                this.handleChickenDeath(enemy);
                return;
            }
            if (!this.character.isDead() && this.character.isColliding(enemy)) {
                this.handleCharacterHit(enemy);
            }
        });
    }

    handleChickenDeath(enemy) {
        enemy.img = enemy.IMAGE_DEAD;
        enemy.loadImage(enemy.IMAGE_DEAD);
        enemy.isDeadStatus = true;
        this.soundManager.stop('chicken');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id); // Nur dieses Chicken entfernen
        }, 500);
    }

    handleCharacterHit(enemy) {
        if (enemy instanceof Endboss) {
            this.character.hit(40);
        } else {
            this.character.hit(20);
        }
        if (this.character.hurtSoundPlayed) {
            this.musicPaused ? this.soundManager.stop('hurt') : this.soundManager.play('hurt');
            this.character.hurtSoundPlayed = false;
        }
        this.healthBar.setPercentage(this.character.energy);
        if (this.character.isDead() && !this.gameOver) {
            setTimeout(() => {
                this.gameOver = true;
                this.gameRunning = false;
            }, 1000);
        }
    }

    checkThrowObjects() {
        this.throwBottle();
        this.checkBottleCollisions();
    }

    throwBottle() {
        if (this.keyboard.SPACE && this.throwableObject.length === 0 && !world.character.isDead()) {
            if (this.bottleCount > 0) {
                this.createThrowableBottle();
                this.updateBottleCount();
                this.playThrowSound();
            }
        }
    }

    createThrowableBottle() {
        let bottle = new ThrowableObject(this.character.x, this.character.y);
        this.throwableObject.push(bottle);
    }

    updateBottleCount() {
        this.bottleCount--;
        this.throwCount = (this.throwCount || 0) + 1;

        if (this.throwCount >= 2) {
            this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
            this.throwCount = 0;
        }
    }

    playThrowSound() {
        this.musicPaused ? this.soundManager.stop('throw') : this.soundManager.play('throw');
    }

    checkBottleCollisions() {
        this.throwableObject.forEach((bottle, index) => {
            if (this.isBottleOutOfBounds(bottle)) {
                this.removeBottle(index);
                return;
            }
            this.checkEnemyCollisions(bottle);
        });
    }

    isBottleOutOfBounds(bottle) {
        return bottle.y >= 380 || bottle.broken;
    }

    removeBottle(index) {
        this.throwableObject.splice(index, 1);
    }

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

    handleEndbossHit(enemy) {
        this.applyDamageToEndboss(enemy);
        if (enemy.isDead()) {
            this.handleEndbossDeath(enemy);
        }
        this.bossHealthBar.setPercentage(enemy.energy);
    }

    applyDamageToEndboss(enemy) {
        enemy.hit(20);
        enemy.isHurtStatus = true;
        if (enemy.energy >= 20) {
            this.playEndbossSound();
        }
    }

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

    handleEndbossDeath(enemy) {
        enemy.isDeadStatus = true;
        this.musicPaused ? this.soundManager.stop('boss_chicken_start') : this.soundManager.play('boss_chicken_start');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id);
            this.bossSpawned = false;
            this.endbossDefeated = true;
            this.drawScreenIcons();
        }, enemy.IMAGES_DEAD.length * 300);
    }

    handleEnemyHit(enemy) {
        this.level.enemies = this.level.enemies.filter(e => e.id !== enemy.id);
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }

    };

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        })
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1
    }
}