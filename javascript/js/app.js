import { bball } from "./gameObjects.js";
import {
  generateTeam,
  control,
  animate,
  updateBallActivity,
  drawTeam,
  draw_bball,
  updateScore,
} from "./gameMethods.js";
import { drawBackground, drawCourtLines } from "./drawCourt.js";

function update() {
  // control(controlPlayer);
  for (const player of players) {
    if (!player.isShooting) {
      player.control(bball);
      player.dribble(bball);
      animate(player);
    }
  }
  updateBallActivity(bball, controlPlayer, players);
  updateScore(roster1, roster2);
}

function render() {
  drawBackground("#b86125");
  drawCourtLines();
  drawTeam(roster1, "green");
  drawTeam(roster2, "purple");
  draw_bball();
  context.drawImage(
    buffer.canvas,
    0,
    0,
    buffer.canvas.width,
    buffer.canvas.height,
    0,
    0,
    context.canvas.width,
    context.canvas.height
  );
}

const [roster1, roster2] = generateTeam();
const players = roster1.players.concat(roster2.players);

let controlPlayer = roster1.players[0];

for (const player of players) {
  player.playerDOM.addEventListener("click", () => {
    controlPlayer = player;
  });
}

const engine = new Engine(1000 / 30, update, render);

resize();
engine.start();
