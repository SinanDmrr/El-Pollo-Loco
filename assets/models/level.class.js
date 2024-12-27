class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 1520;
    level_begin_x = -600;

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects
    }
}