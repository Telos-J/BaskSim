const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const buffer = document.createElement("canvas").getContext("2d");
const controller = new Controller();
let mousePos = new Vector2();

buffer.canvas.width = 940;
buffer.canvas.height = 500;

function keyDownUp(event) {
  controller.keyDownUp(event.type, event.keyCode);
}

function handleMouseMove(event) {
  mousePos = convertToBufferCoord(
    new Vector2(event.clientX, event.clientY)
  );
};

window.addEventListener("resize", resize);
window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);
canvas.addEventListener("mousemove", handleMouseMove);

gsap.registerPlugin(MorphSVGPlugin);