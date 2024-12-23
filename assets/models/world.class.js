class World {
    character = new Character();
    clouds = [
        new Cloud('assets/img/5_background/layers/4_clouds/full.png')
    ];
    backgrounds = [
        new BackgroundObject('assets/img/5_background/layers/air.png'),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/full.png'),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/full.png'),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/full.png'),
        new BackgroundObject('assets/img/5_background/layers/air.png', 1440),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/full.png', 1440),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/full.png', 1440),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/full.png', 1440)
    ];
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];

    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgrounds);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        requestAnimationFrame(() => {
            this.draw()
        });
    };

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    };

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        })
    }
}