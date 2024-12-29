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
    }

    loadSound() {
        this.soundManager.loadSound('walking', 'assets/sounds/walking.mp3');
        this.soundManager.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.soundManager.setVolume('jumping', 0.1);
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

    //TODO über x >= 1200 spawnt Endgegner außerhalb des sichtbereichs und kommt rein gelaufen
    spawnChicken() {
        const spawnInterval = setInterval(() => {
            if (this.character.x >= 1200 || world.character.isDead()) {
                console.log("Spawning beendet!");
                clearInterval(spawnInterval);
                return;
            }
            const newChicken = new Chicken();
            this.level.enemies.push(newChicken);
            console.log("Neues Chicken gespawnt. Aktuelle Anzahl:", this.level.enemies.length);
        }, 2000);
    }


    stopGame() {
        this.soundManager.stopAll();
        intervalIds.forEach((interval) => {
            clearInterval(interval);
        });
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100)
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingFromTop(enemy)) {
                this.level.enemies.splice(index, 1);
            } else if (this.character.isColliding(enemy)) {
                if (enemy instanceof Endboss) {
                    this.character.hit(40);
                } else {
                    this.character.hit(20);
                }
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    // checkThrowObjects() {
    //     if (this.keyboard.SPACE) {
    //         let bottle = new ThrowableObject(this.character.x, this.character.y);
    //         this.throwableObject.push(bottle);
    //     }
    // }

    checkThrowObjects() {
        this.throwableObject.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit(20); // Endboss nimmt 20 Schaden
                    } else {
                        this.level.enemies.splice(enemyIndex, 1); // Normaler Gegner wird entfernt
                    }
                    this.throwableObject.splice(bottleIndex, 1); // Flasche wird entfernt
                }
            });
        });

        // Wurfobjekt erstellen, wenn SPACE gedrückt wird
        if (this.keyboard.SPACE) {
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            this.throwableObject.push(bottle);
        }
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