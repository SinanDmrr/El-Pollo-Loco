let canvas;
let ctx;
let world;
let keyboard = new KeyboardKey();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    console.log(world);
};

window.addEventListener('keydown', (event) => {
    keyboard.keyDown(event);
});

window.addEventListener('keyup', (event) => {
    keyboard.keyUp(event);
});