class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 1620;
    level_begin_x = -600;

    constructor(enemies, clouds, backgroundObjects, character) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects
        this.character = character;
    }
}