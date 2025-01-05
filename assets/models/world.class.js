class World {
    healthBar = new Statusbar();
    bossHealthBar = new Statusbar('boss', 5, 500);
    coinBar = new Statusbar('coin', 40);
    bottleBar = new Statusbar('bottle', 80);
    character = new Character();
    throwableObject = [];
    bottleCount = 0;
    gameRunning = true;
    gameOver = false;
    endbossSpwaned = false;
    endbossDefeated = false;

    level = level1;
    canvas;
    ctx;
    keyboard;
    soundManager;
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
        this.soundManager.play('backgroundmusic');
        this.soundManager.loop('backgroundmusic', true);
        this.spawnChicken();
        this.spawnInitialCollectables();
    }

    loadSound() {
        this.soundManager.loadSound('walking', 'assets/sounds/walking.mp3');
        this.soundManager.setVolume('walking', 0.05);
        this.soundManager.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.soundManager.setVolume('jumping', 0.005);
        this.soundManager.loadSound('throw', 'assets/sounds/throw.mp3');
        this.soundManager.setVolume('throw', 0.05);
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

    //TODO DRAW
    draw() {
        if (this.gameOver) {
            //GAME OVER HIER IMPLEMENTIEREN
            let gameOverImage = new Image();
            gameOverImage.src = "assets/img/9_intro_outro_screens/game_over/game over.png";
            gameOverImage.onload = () => {
                this.ctx.drawImage(gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            };
            this.soundManager.stop('backgroundmusic');
            this.soundManager.play('game_lose');
        } else if (this.endbossDefeated) {
            //GAME OVER HIER IMPLEMENTIEREN
            let winImage = new Image();
            winImage.src = "assets/img/9_intro_outro_screens/win/win_2.png";
            winImage.onload = () => {
                this.ctx.drawImage(winImage, 0, 0, this.canvas.width, this.canvas.height);
            };
            this.soundManager.stop('backgroundmusic');
            this.soundManager.play('game_win');
        } else if (this.gameRunning) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.translate(this.camera_x, 0);

            this.addObjectsToMap(this.level.backgroundObjects);
            this.addObjectsToMap(this.level.clouds);

            this.ctx.translate(-this.camera_x, 0);
            this.addToMap(this.healthBar);
            this.addToMap(this.coinBar);
            this.addToMap(this.bottleBar);
            if (this.bossSpawned) {
                this.addToMap(this.bossHealthBar);
            }
            this.ctx.translate(this.camera_x, 0);

            this.addToMap(this.character);

            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.collectables);
            this.addObjectsToMap(this.throwableObject);

            this.ctx.translate(-this.camera_x, 0);

            this.animationFrameId = requestAnimationFrame(() => {
                this.draw();
            });
        }
    }

    spawnChicken() {
        const spawnInterval = setInterval(() => {
            if (this.character.isDead()) {
                clearInterval(spawnInterval);
                return;
            }

            if (this.character.x >= 1200 && !this.bossSpawned) {
                const spawnX = this.character.x + 650;
                const newEndboss = new Endboss();
                this.soundManager.play('boss_chicken_start');
                setTimeout(() => {
                    this.soundManager.stop('boss_chicken_start');
                }, 800)
                newEndboss.x = spawnX;
                this.bossHealthBar = new Statusbar('boss', 5, 500);
                this.bossSpawned = true;
                this.level.enemies.push(newEndboss);
                clearInterval(spawnInterval);
                return;
            }

            const numberOfChickens = Math.floor(Math.random() * 3) + 1;
            const baseSpawnX = this.character.x + 650;

            for (let i = 0; i < numberOfChickens; i++) {
                this.soundManager.play('chicken');
                const newChicken = new Chicken();
                newChicken.x = baseSpawnX + i * 100;
                this.level.enemies.push(newChicken);
            }
        }, 2000);
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
        let enemiesToRemove = [];

        this.level.enemies.forEach((enemy, index) => {
            if (enemy.isDeadStatus) return;

            if (this.character.isCollidingFromTop(enemy)) {
                if (enemy instanceof Chicken) {
                    enemy.img = enemy.IMAGE_DEAD;
                    enemy.loadImage(enemy.IMAGE_DEAD);
                    enemy.isDeadStatus = true;

                    setTimeout(() => {
                        enemiesToRemove.push(index);
                    }, 500);
                }
                return;
            }

            if (this.character.isColliding(enemy)) {
                if (enemy instanceof Endboss) {
                    this.character.hit(40);
                } else {
                    this.character.hit(20);
                }

                this.healthBar.setPercentage(this.character.energy);

                if (this.character.isDead() && !this.gameOver) {
                    setTimeout(() => {
                        this.gameOver = true;
                        this.gameRunning = false;
                    }, 1000)
                }
            }
        });

        enemiesToRemove.reverse().forEach(index => this.level.enemies.splice(index, 1));
    }

    checkThrowObjects() {
        if (this.keyboard.SPACE && this.throwableObject.length === 0 && !world.character.isDead()) {
            if (this.bottleCount > 0) {
                let bottle = new ThrowableObject(this.character.x, this.character.y);
                this.throwableObject.push(bottle);

                this.bottleCount--;
                this.throwCount = (this.throwCount || 0) + 1;

                if (this.throwCount >= 2) {
                    this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
                    this.throwCount = 0;
                }
                this.soundManager.play('throw');
            }
        }

        this.throwableObject.forEach((bottle, index) => {
            if (bottle.y >= 380 || bottle.broken) {
                this.throwableObject.splice(index, 1);
                return;
            }

            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    bottle.broken = true;
                    if (enemy instanceof Endboss) {
                        enemy.hit(20);
                        enemy.isHurtStatus = true;
                        if (enemy.energy >= 20) {
                            this.soundManager.play('boss_chicken_start');
                            setTimeout(() => {
                                this.soundManager.stop('boss_chicken_start');
                            }, 300)
                        }
                        if (enemy.isDead()) {
                            enemy.isDeadStatus = true;
                            this.soundManager.play('boss_chicken_start');
                            setTimeout(() => {
                                this.level.enemies.splice(enemyIndex, 1);
                                this.endbossDefeated = true;
                                this.bossSpawned = false;
                            }, enemy.IMAGES_DEAD.length * 280);
                        }
                        this.bossHealthBar.setPercentage(enemy.energy);
                    } else {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                }
            });
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawCollisonBorder(this.ctx);
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