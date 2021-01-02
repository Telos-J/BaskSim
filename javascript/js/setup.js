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

const dribbleBall = document.querySelector('#dribbleBall')

const blobs = Array.from(document.getElementsByClassName("blob"));
const idle = document.querySelector(".blob");
const idle_paths = Array.from(idle.querySelectorAll('path'));
const idle2 = document.querySelector("#idle2");
const idle2_paths = Array.from(idle2.querySelectorAll('path'));

const walk = document.querySelector("#walk");
const walk_paths = Array.from(walk.querySelectorAll('path'));
const walk2 = document.querySelector("#walk2");
const walk2_paths = Array.from(walk2.querySelectorAll('path'));
const walk3 = document.querySelector("#walk3");
const walk3_paths = Array.from(walk3.querySelectorAll('path'));
const walk4 = document.querySelector("#walk4");
const walk4_paths = Array.from(walk4.querySelectorAll('path'));
const walk_timeline = gsap.timeline({ paused: true });

const dribble = document.querySelector("#dribble");
const dribble_paths = Array.from(dribble.querySelectorAll('path'));
const dribble2 = document.querySelector("#dribble2");
const dribble2_paths = Array.from(dribble2.querySelectorAll('path'));
const dribble3 = document.querySelector("#dribble3");
const dribble3_paths = Array.from(dribble3.querySelectorAll('path'));
const dribble4 = document.querySelector("#dribble4");
const dribble4_paths = Array.from(dribble4.querySelectorAll('path'));
const dribble_timeline = gsap.timeline({ paused: true });
