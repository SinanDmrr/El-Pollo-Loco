class DrawableObject {
    img;
    imgCache = {};
    currentImage = 0;
    x = 120;
    y = 220;
    height = 150;
    width = 100;

    /**
     * Loads an image from the given path and sets it to the object's img property.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images from an array of paths and caches them.
     * @param {string[]} arr - An array of image file paths to load and cache.
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }

    /**
     * Draws the object's current image on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw the image on.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}