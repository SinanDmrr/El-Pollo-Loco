class CollectableObject extends MovableObject {
    width = 720;
    height = 480;
    path = 'assets/img/8_coin/coin_1.png';

    constructor(x = -700, y = 250) {
        super().loadImage(this.path);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
    }
}