import { ball } from "./gameObjects.js";
import { generateTeams, collectPlayers, updateBallActivity, updateScore } from "./gameMethods.js";
import { drawBackground, drawCourtLines } from "./drawCourt.js";

function update() {
  for (let player of players) {
    player.initState()
  }

  for (let player of players) {
    if (!player.coolTime) player.control(ball, players);
  }

  for (let player of players) {
    player.animate();
    player.update();
  }

  // updateBallActivity(ball, players);
  // updateScore(roster1, roster2);
  ball.update();
}

function render() {
  drawBackground("#b86125");
  drawCourtLines();
  players[0].drawNeighborhood();

  for (let player of players) {
    player.drawPosition()
  }

  ball.drawPosition()

  topviewContext.drawImage(
    buffer.canvas,
    0,
    0,
    buffer.canvas.width,
    buffer.canvas.height,
    0,
    0,
    topview.width,
    topview.height
  );
}

const [roster1, roster2] = generateTeams();
const players = collectPlayers(roster1, roster2);
const engine = new Engine(1000 / 30, update, render);

resize();
engine.start();
