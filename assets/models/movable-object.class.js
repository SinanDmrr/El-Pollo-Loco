class MovableObject {
    img;
    /**
     * Lädt ein einzelnes Bild
     * 
     * @param {*} path - Der Pfad zur Bilddatei, die geladen werden soll
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("Moving right");
    }

    moveLeft() {
        console.log("Movin left");
    }
}