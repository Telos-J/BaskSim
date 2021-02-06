import { Player, Attribute, Team, bball } from "./gameObjects.js";
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

function generateTeam() {
  const target1 = {
    x: buffer.canvas.width - 55,
    y: buffer.canvas.height / 2,
  };

  const target2 = {
    x: 55,
    y: buffer.canvas.height / 2,
  };

  const centerAttribute = new Attribute(0.45, 0.24, 0.67, 89, 65);
  const sforwardAttribute = new Attribute(0.53, 0.31, 0.77, 78, 76);
  const pforwardAttribute = new Attribute(0.5, 0.29, 0.75, 81, 70);
  const pguardAttribute = new Attribute(0.58, 0.39, 0.85, 71, 83);
  const sguardAttribute = new Attribute(0.61, 0.48, 0.79, 90, 83);

  const team1 = new Team(
    [
      new Player(
        "PG",
        185,
        86,
        11,
        "Myron Boyce",
        338,
        272,
        target1,
        pguardAttribute
      ),
      new Player(
        "SG",
        198,
        94,
        24,
        "Adam Chester",
        293,
        135,
        target1,
        sguardAttribute
      ),
      new Player(
        "SF",
        202,
        101,
        34,
        "Daanyal Graves",
        101,
        423,
        target1,
        sforwardAttribute
      ),
      new Player(
        "PF",
        208,
        111,
        21,
        "Tyreese Ward",
        88,
        181,
        target1,
        pforwardAttribute
      ),
      new Player(
        "C",
        217,
        121,
        12,
        "Donovan Robinson",
        154,
        341,
        target1,
        centerAttribute
      ),
    ],
    "green"
  );

  const team2 = new Team(
    [
      new Player(
        "PG",
        184,
        89,
        7,
        "Damion Lee",
        buffer.canvas.width - 338,
        272,
        target2,
        pguardAttribute
      ),
      new Player(
        "SG",
        200,
        98,
        13,
        "Chris Paul",
        buffer.canvas.width - 293,
        135,
        target2,
        sguardAttribute
      ),
      new Player(
        "SF",
        206,
        102,
        23,
        "Zaire Willams",
        buffer.canvas.width - 101,
        423,
        target2,
        sforwardAttribute
      ),
      new Player(
        "PF",
        210,
        107,
        34,
        "Giannis Antetokumpo",
        buffer.canvas.width - 88,
        181,
        target2,
        pforwardAttribute
      ),
      new Player(
        "C",
        216,
        128,
        54,
        "Dwight Howard",
        buffer.canvas.width - 154,
        341,
        target2,
        centerAttribute
      ),
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

function drawTeam(team) {
  team.players.forEach((player) => {
    let position = convertToWindowCoord(
      player.playerDOM.querySelector("svg").classList.contains("flip")
        ? new Vector2(player.x - 20, player.y - 20)
        : new Vector2(player.x - 40, player.y - 20)
    );

    player.playerDOM.style.transform =
      "translate(" + position.x + "px, " + position.y + "px)";
  });
}

function draw_bball() {
  const bballDOM = document.querySelector("#basketball");
  let position = convertToWindowCoord(new Vector2(bball.x - 15, bball.y - 15));

  bballDOM.style.transform =
    "translate(" + position.x + "px, " + position.y + "px)";
}

function control(controlPlayer) {
  controlPlayer.wasMoving = controlPlayer.isMoving;

  if (buffer.canvas.height >= controlPlayer.y) {
    if (controller.down.active) {
      controlPlayer.y += 5;
      controlPlayer.isMoving = true;
    } else controlPlayer.isMoving = false;
  }
  if (0 < controlPlayer.y) {
    if (controller.up.active) {
      controlPlayer.y -= 5;
      controlPlayer.isMoving = true;
    }
  }
  if (buffer.canvas.width >= controlPlayer.x) {
    if (controller.right.active) {
      controlPlayer.playerDOM.classList.remove("flip");
      controlPlayer.x += 5;
      controlPlayer.isMoving = true;
    }
  }
  if (0 < controlPlayer.x) {
    if (controller.left.active) {
      controlPlayer.playerDOM.classList.add("flip");
      controlPlayer.x -= 5;
      controlPlayer.isMoving = true;
    }
  }
  if (controller.space.active && controlPlayer.hasBall)
    controlPlayer.shoot(bball);
  if (
    !controller.left.active &&
    !controller.down.active &&
    !controller.up.active &&
    !controller.right.active
  )
    controlPlayer.isMoving = false;
  controlPlayer.playerDOM.style.zIndex = controlPlayer.y;
}

function animate(controlPlayer) {
  const character = controlPlayer.playerDOM.querySelector("#character");
  const paths = Array.from(character.querySelectorAll("path"));
  const fullPaths = Array.from(
    controlPlayer.playerDOM.querySelectorAll("path")
  );

  if (!controlPlayer.wasMoving && controlPlayer.isMoving) {
    if (controlPlayer.hasBall) {
      document.querySelector("#basketball").style.display = "none";
      dribbleAnimation(fullPaths);
    } else walkAnimation(paths);
  } else if (controlPlayer.wasMoving && !controlPlayer.isMoving) {
    if (controlPlayer.hasBall) {
      document.querySelector("#basketball").style.display = "none";
      idleDribbleAnimation(fullPaths);
    } else {
      controlPlayer.playerDOM.querySelector("#dribbleBall").style.display =
        "none";
      idleAnimation(paths);
    }
  }
}

function updateBallActivity(bball, controlPlayer, players) {
  if (controlPlayer.grabBall) {
    for (const player of players) {
      if (player !== controlPlayer && player.hasBall) {
        const character = player.playerDOM.querySelector("#character");
        const bballDOM = player.playerDOM.querySelector("#dribbleBall");
        const paths = Array.from(character.querySelectorAll("path"));
        player.hasBall = false;
        bballDOM.style.display = "none";

        if (player.isMoving) walkAnimation(paths);
        else idleAnimation(paths);
      }
    }
  }

  if (bball.shooting) {
    bball.move();
    if (bball.reachTarget()) {
      bball.shooting = false;

      if (bball.isGoal()) {
        bball.makeGoal();
        controlPlayer.updateStat({
          goal: true,
          bball_probability: bball.probability,
        });
      } else {
        bball.bounceoff();
        controlPlayer.updateStat({
          goal: false,
        });
      }
    }
  } else if (bball.bouncingoff) {
    bball.move();
    if (bball.reachTarget()) {
      bball.bouncingoff = false;
    }
  }
}

function updateScore(team1, team2) {
  document.querySelector("#green-score").innerHTML = team1.score;
  document.querySelector("#purple-score").innerHTML = team2.score;
}

export {
  generateTeam,
  control,
  animate,
  updateBallActivity,
  drawTeam,
  draw_bball,
  updateScore,
};
