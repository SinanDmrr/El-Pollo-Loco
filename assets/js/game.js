let canvas;
let ctx;
let world;
let intervalIds = [];
let keyboard = new KeyboardKey();
let soundManager = new SoundManager();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, soundManager);
    checkOrientation();
}

window.addEventListener('keydown', (event) => {
    keyboard.keyDown(event);
});

window.addEventListener('keyup', (event) => {
    keyboard.keyUp(event);
});

function setKey(key, value) {
    keyboard[key] = value;
}

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

window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
