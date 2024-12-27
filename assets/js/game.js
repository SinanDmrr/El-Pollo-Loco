let canvas;
let ctx;
let world;
let keyboard = new KeyboardKey();
let soundManager = new SoundManager();
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, new SoundManager());

    console.log(world);
};

window.addEventListener('keydown', (event) => {
    keyboard.keyDown(event);
});

window.addEventListener('keyup', (event) => {
    keyboard.keyUp(event);
});