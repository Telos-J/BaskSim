const canvas = document.querySelector('#court-canvas')
const context = canvas.getContext('2d')
const padding = 5
const width = 940
const height = 144
canvas.width = width + padding * 2
canvas.height = height + padding * 2
canvas.style.width = canvas.width + 'px'
canvas.style.height = canvas.height + 'px'

const topview = document.querySelector("#topview-canvas");
const topviewContext = topview.getContext("2d");
const buffer = document.createElement("canvas").getContext("2d");
const controller = new Controller();
let mousePos = new Vector2();

buffer.canvas.width = 940;
buffer.canvas.height = 500;

function handleMouseMove(event) {
    mousePos = convertToBufferCoord(
        new Vector2(event.clientX, event.clientY)
    );
};

window.addEventListener("resize", resize);
window.addEventListener('keydown', (e) => controller.keydown(e))
window.addEventListener('keyup', (e) => controller.keyup(e))
// canvas.addEventListener("mousemove", handleMouseMove);

gsap.registerPlugin(MorphSVGPlugin);
