class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectables;
    level_end_x = 1850;
    level_begin_x = -1300;

    constructor(enemies, clouds, backgroundObjects, collectables, character) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectables = collectables;
        this.character = character;
    }
}