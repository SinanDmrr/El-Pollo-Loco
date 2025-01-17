class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
    IMAGES_COIN = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];
    IMAGES_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    IMAGES_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green100.png',
    ];

    percentage = 100;
    collectablePercentage = 0;

    constructor(type = 'health', y = 0, x = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;

        switch (type) {
            case 'coin':
                this.IMAGES = this.IMAGES_COIN;
                this.loadAndSet(this.IMAGES, this.collectablePercentage);
                break;
            case 'bottle':
                this.IMAGES = this.IMAGES_BOTTLE;
                this.loadAndSet(this.IMAGES, this.collectablePercentage);
                break;
            case 'boss':
                this.IMAGES = this.IMAGES_ENDBOSS;
                this.loadAndSet(this.IMAGES, this.percentage);
                break;
            default:
                this.IMAGES = this.IMAGES_HEALTH;
                this.loadAndSet(this.IMAGES, this.percentage);
        }
    }

    /**
     * Loads images and sets the percentage to determine the current image.
     * @param {string[]} IMAGES - An array of image paths to load.
     * @param {number} Percentage - The percentage to set and determine the current image.
     */
    loadAndSet(IMAGES, Percentage) {
        this.loadImages(IMAGES);
        this.setPercentage(Percentage);
    }

    /**
     * Sets the percentage and updates the current image based on the percentage.
     * @param {number} percentage - The percentage to set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.getIndexOfImage()];
        this.img = this.imgCache[path];
    }

    /**
     * Gets the index of the image based on the current percentage.
     * @returns {number} The index of the image corresponding to the current percentage.
     */
    getIndexOfImage() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}