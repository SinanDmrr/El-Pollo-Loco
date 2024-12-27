// class Endboss extends MovableObject {
//     x = 1550;
//     y = 150;
//     width = 300;
//     height = 300;
//     currentImage = 0;

//     IMAGES_WALKING = [
//         'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
//         'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
//         'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
//         'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
//     ];

//     IMAGES_ALERT = [
//         'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
//         'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
//     ];

//     constructor() {
//         super().loadImage('assets/img/4_enemie_boss_chicken/1_walk/G1.png');
//         this.loadImages(this.IMAGES_WALKING);
//         this.loadImages(this.IMAGES_ALERT);
//         this.speed = 0.5;
//         this.animate();

//     }

//     animate() {
//         let animationFrameCounter = 0;

//         const animateFrame = () => {
//             this.moveLeft(this.speed);
//             this.moveRight(this.speed);
//             animationFrameCounter++;

//             if (animationFrameCounter > 16) {
//                 this.playAnimation(this.IMAGES_WALKING);
//                 animationFrameCounter = 0;
//             }

//             requestAnimationFrame(animateFrame);
//         };
//         animateFrame();
//     }
// }

class Endboss extends MovableObject {
    x = 1550;
    y = 150;
    width = 300;
    height = 300;
    currentImage = 0;

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor() {
        super().loadImage('assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.speed = 0.5;
        this.animate();
    }

    animate() {
        let animationFrameCounter = 0;
        let directionChangeInterval = 2000; // Zeitintervall für Richtungswechsel (2 Sekunden)
        let currentDirection = this.randomDirection(); // Initiale Richtung setzen
        let lastDirectionChange = Date.now(); // Zeitstempel für den letzten Richtungswechsel

        const animateFrame = () => {
            // Wenn 2 Sekunden vergangen sind, ändere die Richtung
            if (Date.now() - lastDirectionChange > directionChangeInterval) {
                currentDirection = this.randomDirection();
                lastDirectionChange = Date.now(); // Aktualisiere den Zeitstempel
            }

            // Bewege den Endboss in die gewählte Richtung, aber mit Begrenzung
            if (currentDirection === 'left') {
                if (this.x > 1520) { // Begrenzung auf der linken Seite
                    this.moveLeft(this.speed);
                } else {
                    currentDirection = 'right'; // Richtungswechsel, wenn Grenze erreicht ist
                }
            } else {
                if (this.x < 1800) { // Begrenzung auf der rechten Seite
                    this.moveRight(this.speed);
                } else {
                    currentDirection = 'left'; // Richtungswechsel, wenn Grenze erreicht ist
                }
            }

            animationFrameCounter++;

            if (animationFrameCounter > 16) {
                this.playAnimation(this.IMAGES_WALKING);
                animationFrameCounter = 0;
            }

            requestAnimationFrame(animateFrame); // Weiter zur nächsten Animation
        };

        animateFrame();
    }

    randomDirection() {
        // Zufällige Entscheidung (links oder rechts)
        return Math.random() > 0.5 ? 'left' : 'right';
    }
}
