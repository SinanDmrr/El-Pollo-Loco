let canvas;
let ctx;
let world;
let intervalIds = [];
let keyboard = new KeyboardKey();
let soundManager = new SoundManager();
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, new SoundManager());
};

window.addEventListener('keydown', (event) => {
    keyboard.keyDown(event);
});

window.addEventListener('keyup', (event) => {
    keyboard.keyUp(event);
});