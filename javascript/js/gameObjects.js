import {
  idleDribbleAnimation,
  dribbleAnimation,
  walkAnimation,
  idleAnimation,
} from "./animation.js";

class Attribute {
  constructor(shoot, shoot3, defence, stamina, speed) {
    this.shoot = shoot;
    this.shoot3 = shoot3;
    this.defence = defence;
    this.stamina = stamina;
    this.speed = speed;
  }
}

class Player {
  constructor(
    role,
    height,
    weight,
    back_number,
    name,
    x,
    y,
    target,
    attribute
  ) {
    this.role = role;
    this.height = height;
    this.weight = weight;
    this.back_number = back_number;
    this.name = name;
    this.x = x;
    this.y = y;
    this.target = target;
    this.hasBall = false;
    this.attribute = attribute;
    this.attempt = 0;
    this.score = 0;
    this.goals = 0;
    this.shootProb = 0;
    this.frames = [];
    this.framenum = 0;
    this.isMoving = false;
    this.wasMoving = false;
  }

  dribble(ball) {
    const distance = Math.hypot(this.x - ball.x, this.y - ball.y);
    if (distance < ball.size && !ball.shooting && !this.hasBall) {
      this.hasBall = true;
      this.playerDOM.querySelector("#dribbleBall").style.display = "block";
      const paths = Array.from(this.playerDOM.querySelectorAll("path"));
      document.querySelector("#basketball").style.display = "none";
      if (this.isMoving) dribbleAnimation(paths);
      else idleDribbleAnimation(paths);
    }
    if (this.hasBall) {
      ball.x = this.x;
      ball.y = this.y;
    }
  }

  shoot(ball) {
    const distHoop = Math.hypot(this.x - this.target.x, this.y - this.target.y);
    const character = this.playerDOM.querySelector("#character");
    const paths = Array.from(character.querySelectorAll("path"));

    this.hasBall = false;
    ball.shooting = true;
    ball.target.x = this.target.x;
    ball.target.y = this.target.y;

    if (distHoop > 235.8) ball.probability = this.attribute.shoot3;
    else ball.probability = this.attribute.shoot;

    document.querySelector("#basketball").style.display = "block";
    this.playerDOM.querySelector("#dribbleBall").style.display = "none";
    if (this.isMoving) walkAnimation(paths);
    else idleAnimation(paths);
  }

  updateStat({ goal, bball_probability }) {
    this.attempt += 1;
    if (goal) {
      if (bball_probability == this.attribute.shoot3) {
        this.score += 3;
        this.team.score += 3;
      } else {
        this.score += 2;
        this.team.score += 2;
      }

      this.goals += 1;
    }
    this.shootProb = this.goals / this.attempt;
    console.log("score: ", this.score);
    console.log("shootProb: ", this.shootProb);
  }
}

class Team {
  constructor(players, color) {
    this.players = players;
    this.color = color;
    this.score = 0;
  }
}

const bball = {
  x: buffer.canvas.width / 2,
  y: buffer.canvas.height / 2,
  speed: 10,
  size: 15,
  shooting: false,
  bouncingoff: false,
  probability: 0,
  target: { x: 0, y: 0 },
  move() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const angle = Math.atan2(dy, dx);

    this.x += this.speed * Math.cos(angle);
    this.y += this.speed * Math.sin(angle);
  },
  reachTarget() {
    const dist = Math.hypot(this.target.x - this.x, this.target.y - this.y);

    if (dist < this.size / 1.5) return true;
    else return false;
  },
  isGoal() {
    return Math.random() < bball.probability;
  },
  makeGoal() {
    this.x = this.target.x;
    this.y = this.target.y;
  },
  bounceoff() {
    this.bouncingoff = true;
    const angle = Math.random() * Math.PI + (Math.PI * 3) / 2;
    if (this.target.x > buffer.canvas.width / 2) {
      this.target.x = this.target.x - 80 * Math.cos(angle);
      this.target.y = this.target.y + 80 * Math.sin(angle);
    } else {
      this.target.x = this.target.x + 80 * Math.cos(angle);
      this.target.y = this.target.y + 80 * Math.sin(angle);
    }
  },
};

export { Player, Attribute, Team, bball };
