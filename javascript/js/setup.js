const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const buffer = document.createElement('canvas').getContext('2d');
const controller = new Controller();

buffer.canvas.width = 940;
buffer.canvas.height = 500;

window.addEventListener('resize', resize);

function keyDownUp(event) {
    controller.keyDownUp(event.type, event.keyCode);
}

window.addEventListener('keydown', keyDownUp);
window.addEventListener('keyup', keyDownUp);
canvas.addEventListener('mousemove', handleMouseMove);
