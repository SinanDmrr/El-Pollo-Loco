let canvas;
let ctx;
let world;
let intervalIds = [];
let keyboard = new KeyboardKey();
let soundManager = new SoundManager();

/**
 * Initializes the game world and checks device orientation.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, soundManager);
    checkOrientation();
}

/**
 * Event listener for keydown events.
 * Adds pressed keys to the keyboard manager.
 * @param {KeyboardEvent} event - The keydown event.
 */
window.addEventListener('keydown', (event) => {
    keyboard.keyDown(event);
});

/**
 * Event listener for keyup events.
 * Removes released keys from the keyboard manager.
 * @param {KeyboardEvent} event - The keyup event.
 */
window.addEventListener('keyup', (event) => {
    keyboard.keyUp(event);
});

/**
 * Sets the value of a key in the keyboard manager.
 * @param {string} key - The key identifier (e.g., 'ArrowUp').
 * @param {boolean} value - The key state (true for pressed, false for released).
 */
function setKey(key, value) {
    keyboard[key] = value;
}

/**
 * Checks the screen orientation and adjusts the display accordingly.
 * Shows a warning if the device is in portrait mode.
 */
function checkOrientation() {
    const warning = document.getElementById('orientation-warning');
    const canvas = document.getElementById('canvas');
    const controls = document.getElementById('mobile-controls');

    if (window.innerWidth < window.innerHeight) {
        warning.classList.remove('hidden');
        canvas.classList.add('hidden');
        controls.style.display = 'none';
    } else {
        warning.classList.add('hidden');
        canvas.classList.remove('hidden');

        if (window.innerHeight <= 1024) {
            controls.style.display = 'flex';
        } else {
            controls.style.display = 'none';
        }
    }
}

/**
 * Checks the screen orientation when the page loads.
 */
window.addEventListener('load', checkOrientation);

/**
 * Checks the screen orientation when the window is resized.
 */
window.addEventListener('resize', checkOrientation);
