const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const buffer = document.createElement("canvas").getContext("2d");
const controller = new Controller();

buffer.canvas.width = 940;
buffer.canvas.height = 500;

window.addEventListener("resize", resize);

function keyDownUp(event) {
  controller.keyDownUp(event.type, event.keyCode);
}

window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);
canvas.addEventListener("mousemove", handleMouseMove);

gsap.registerPlugin(MorphSVGPlugin);

const blobs = Array.from(document.getElementsByClassName("blob"));
const idle = document.querySelector(".blob");
const idle_paths = Array.from(idle.children);
const idle2 = document.querySelector("#idle2");
const idle2_paths = Array.from(idle2.children);

const walk = document.querySelector("#walk");
const walk_paths = Array.from(walk.children);
const walk2 = document.querySelector("#walk2");
const walk2_paths = Array.from(walk2.children);
const walk3 = document.querySelector("#walk3");
const walk3_paths = Array.from(walk3.children);
const walk_timeline = gsap.timeline({ paused: true });
