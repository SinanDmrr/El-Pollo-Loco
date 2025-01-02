class World {
    healthBar = new Statusbar();
    coinBar = new Statusbar('coin', 40);
    bottleBar = new Statusbar('bottle', 80);
    character = new Character();
    throwableObject = [];

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
        // this.soundManager.play('backgroundmusic');
        // this.soundManager.loop('backgroundmusic', true);
        this.spawnChicken();
        this.spawnInitialCollectables();
    }

    loadSound() {
        this.soundManager.loadSound('walking', 'assets/sounds/walking.mp3');
        this.soundManager.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.soundManager.setVolume('jumping', 0.025);
        this.soundManager.loadSound('throw', 'assets/sounds/throw.mp3');
        this.soundManager.loadSound('backgroundmusic', 'assets/sounds/background_music.mp3');
        this.soundManager.setVolume('backgroundmusic', 0.2);
        this.soundManager.loadSound('chicken', 'assets/sounds/chicken.mp3');
        this.soundManager.loadSound('game_win', 'assets/sounds/game_win.mp3');
        this.soundManager.loadSound('game_lose', 'assets/sounds/game_lose.mp3');
        this.soundManager.loadSound('boss_chicken_start', 'assets/sounds/boss_chicken_start.mp3');
    }

    setWorld() {
        this.character.world = this;
    }

    spawnChicken() {
        const spawnInterval = setInterval(() => {
            if (this.character.x >= 1200 && !world.character.isDead()) {
                const spawnX = (this.character.x + 650);
                const newEndboss = new Endboss();
                newEndboss.x = spawnX;
                this.level.enemies.push(newEndboss);
                clearInterval(spawnInterval);
                return;
            } else if (this.character.x >= 1200 || world.character.isDead()) {
                clearInterval(spawnInterval);
                return;
            }
            const spawnX = (this.character.x + 650) + Math.random() * 300;
            const newChicken = new Chicken();
            newChicken.x = spawnX;
            this.level.enemies.push(newChicken);
            console.log("Neues Chicken gespawnt. Aktuelle Anzahl:", this.level.enemies.length);
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
        console.log("Collectables gespawnt bei x =", baseX);
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
                    this.coinBar.setPercentage(this.coinBar.percentage + 5); // Coinbar auffüllen
                } else if (collectable.path.includes('bottle')) {
                    this.bottleBar.setPercentage(this.bottleBar.percentage + 20); // Bottlebar auffüllen
                }
                this.level.collectables.splice(index, 1); // Objekt entfernen
            }
        });
    }


    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkForCollectableSpawn();
            //TODO
            this.checkCollectableCollisions();
        }, 100)
    }

    stopGame() {
        this.soundManager.stopAll();
        intervalIds.forEach((interval) => {
            clearInterval(interval);
        });
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingFromTop(enemy) && enemy instanceof Chicken && !enemy.isDeadStatus) {
                enemy.img = enemy.IMAGE_DEAD;
                enemy.loadImage(enemy.IMAGE_DEAD);
                enemy.isDeadStatus = true;
                setTimeout(() => {
                    this.level.enemies.splice(index, 1);
                }, 500);
            }
            if (this.character.isColliding(enemy) && !enemy.isDeadStatus) {
                if (enemy instanceof Endboss) {
                    this.character.hit(40);
                } else {
                    this.character.hit(100);
                }
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    checkThrowObjects() {
        if (this.keyboard.SPACE && !this.hasThrown && !world.character.isDead()) {
            if (this.bottleBar.percentage > 0) {
                this.hasThrown = true;
                let bottle = new ThrowableObject(this.character.x, this.character.y);
                this.throwableObject.push(bottle);

                this.throwCount = (this.throwCount || 0) + 1;

                if (this.throwCount >= 2) {
                    this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
                    this.throwCount = 0;
                }

                this.soundManager.play('throw');
            }
        } else if (!this.keyboard.SPACE) {
            this.hasThrown = false;
        }

        this.throwableObject.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit(20);
                        enemy.isHurtStatus = true;
                        if (enemy.isDead()) {
                            enemy.isDeadStatus = true;
                            setTimeout(() => {
                                this.level.enemies.splice(enemyIndex, 1);
                            }, enemy.IMAGES_DEAD.length * 250);
                        }
                    } else {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                    this.throwableObject.splice(bottleIndex, 1);
                }
            });
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectables);

        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => {
            this.draw()
        });
    };

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawCollisonBorder(this.ctx);
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