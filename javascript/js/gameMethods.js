import { Player, Attribute, Team, ball } from "./gameObjects.js";
import {
  idleAnimation,
  idleDribbleAnimation,
  walkAnimation,
  dribbleAnimation,
  shootAnimation,
} from "./animation.js";

function setPlayerBackNumber(player) {
  player.playerDOM.getElementsByClassName("number")[0].innerHTML =
    player.back_number;
}

function setPlayerInitAnimations(player) {
  const blob = player.playerDOM.querySelector("#character");
  const blob_paths = Array.from(blob.querySelectorAll("path"));
  idleAnimation(blob_paths);
}

function setPlayerDisplayDOMEvents(player) {
  const displayDOM = document.querySelector(".display");

  player.playerDOM.addEventListener("mousemove", (e) => {
    displayDOM.style.display = "block";
    displayDOM.style.transform =
      "translate(" + (e.clientX + 20) + "px, " + (e.clientY + 20) + "px)";
    displayDOM.innerHTML =
      player.name +
      "<br>" +
      player.role +
      "<br>" +
      player.height +
      "cm<br>" +
      player.weight +
      "kg";
  });

  player.playerDOM.addEventListener(
    "mouseleave",
    () => (displayDOM.style.display = "none")
  );
}

function setPlayerDOM(player) {
  const base = document.querySelector("." + player.team.color);

  if (player === player.team.players[0]) player.playerDOM = base;
  else {
    const clone = base.cloneNode(true);
    document.body.insertBefore(clone, base);
    player.playerDOM = clone;
  }

  if (player.target.x < buffer.canvas.width / 2)
    player.playerDOM.classList.add("flip");
  player.playerDOM.style.zIndex = player.y;

  setPlayerBackNumber(player);
  setPlayerInitAnimations(player);
  setPlayerDisplayDOMEvents(player);
}

export function generateTeams() {
  const target1 = new Vector2(buffer.canvas.width - 55, buffer.canvas.height / 2);
  const target2 = new Vector2(55, buffer.canvas.height / 2);

  const centerAttribute = new Attribute(0.45, 0.24, 0.67, 89, 4.5);
  const sforwardAttribute = new Attribute(0.53, 0.31, 0.77, 78, 5.6);
  const pforwardAttribute = new Attribute(0.5, 0.29, 0.75, 81, 5.0);
  const pguardAttribute = new Attribute(0.58, 0.39, 0.85, 71, 5.8);
  const sguardAttribute = new Attribute(0.61, 0.48, 0.79, 90, 5.8);

  const team1 = new Team(
    [
      new Player("PG", 185, 86, 11, "Myron Boyce", 338, 272, target1, pguardAttribute), 
      // new Player("SG", 198, 94, 24, "Adam Chester", 293, 135, target1, sguardAttribute),
      // new Player("SF", 202, 101, 34, "Daanyal Graves", 101, 423, target1, sforwardAttribute),
      // new Player("PF", 208, 111, 21, "Tyreese Ward", 88, 181, target1, pforwardAttribute),
      // new Player("C", 217, 121, 12, "Donovan Robinson", 154, 341, target1, centerAttribute),
    ],
    "green"
  );

  const team2 = new Team(
    [
      new Player("PG", 184, 89, 7, "Damion Lee", buffer.canvas.width - 338, 272, target2, pguardAttribute),
      // new Player("SG", 200, 98, 13, "Chris Paul", buffer.canvas.width - 293, 135, target2, sguardAttribute),
      // new Player("SF", 206, 102, 23, "Zaire Willams", buffer.canvas.width - 101, 423, target2, sforwardAttribute),
      // new Player("PF", 210, 107, 34, "Giannis Antetokumpo", buffer.canvas.width - 88, 181, target2, pforwardAttribute),
      // new Player("C", 216, 128, 54, "Dwight Howard", buffer.canvas.width - 154, 341, target2, centerAttribute),
    ],
    "purple"
  );

  [team1, team2].forEach((team) => {
    team.players.forEach((player) => {
      player.team = team;
      setPlayerDOM(player);
    });
  });

  return [team1, team2];
}

export function collectPlayers(...teams) {
  let players = [];
  for (let team of teams) {
    players = players.concat(team.players)
  }
  return players
}

export function draw_ball() {

}

export function updateBallActivity(ball, players) {
}

export function updateScore(team1, team2) {
  document.querySelector("#green-score").innerHTML = team1.score;
  document.querySelector("#purple-score").innerHTML = team2.score;
}