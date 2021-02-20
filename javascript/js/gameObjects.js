import {
  idleDribbleAnimation,
  dribbleAnimation,
  walkAnimation,
  idleAnimation,
  shootAnimation,
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
    this.position = new Vector2(x, y);
    this.velocity = new Vector2();
    this.avoidance = new Vector2();
    this.target = target;
    this.hasBall = false;
    this.grabBall = false;
    this.attribute = attribute;
    this.attempt = 0;
    this.score = 0;
    this.goals = 0;
    this.shootProb = 0;
    this.frames = [];
    this.framenum = 0;
    this.isMoving = false;
    this.wasMoving = false;
    this.isShooting = false;
    this.range = 100;
  }

  dribble(ball) {
    const distance = this.position.sub(ball.position).magnitude();
    this.grabBall = false;

    if (distance < ball.size && !ball.shooting && !this.hasBall) {
      this.grabBall = true;
      this.hasBall = true;
      this.playerDOM.querySelector("#dribbleBall").style.display = "block";
      const paths = Array.from(this.playerDOM.querySelectorAll("path"));
      document.querySelector("#basketball").style.display = "none";
      if (this.isMoving) dribbleAnimation(paths);
      else idleDribbleAnimation(paths);
    }

    if (this.hasBall) ball.position.set(this.position.x, this.position.y);
  }

  shoot(ball) {
    const distHoop = this.target.sub(this.position).magnitude();
    const character = this.playerDOM.querySelector("#character");
    const fullPaths = Array.from(this.playerDOM.querySelectorAll("path"));
    const paths = Array.from(character.querySelectorAll("path"));

    this.hasBall = false;
    this.isShooting = true;

    if (this.target.x < buffer.canvas.width / 2)
      this.playerDOM.classList.add("flip");
    else this.playerDOM.classList.remove("flip");

    ball.shooting = true;
    ball.target.set(this.target.x, this.target.y);

    if (distHoop > 235.8) ball.probability = this.attribute.shoot3;
    else ball.probability = this.attribute.shoot;

    document.querySelector("#basketball").style.display = "block";
    this.playerDOM.querySelector("#dribbleBall").style.display = "none";
    shootAnimation(fullPaths, this);
    // if (this.isMoving) walkAnimation(paths);
    // else idleAnimation(paths);
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

  control(bball) {
    this.wasMoving = this.isMoving;
    
    if (!this.hasBall) {
      this.velocity = bball.position.sub(this.position).normalize(5)
      this.position = this.position.add(this.velocity)
      this.isMoving = true;
    }
    else {
      if (this.avoidance.magnitude()) { 
        this.position = this.position.add(this.avoidance)
        this.isMoving = true;
      }
      else this.isMoving = false; 
      // this.shoot(bball)
    }

    if (this.position.x < bball.position.x) this.playerDOM.classList.remove("flip");
    else this.playerDOM.classList.add("flip");

    this.playerDOM.style.zIndex = this.position.y;
  }
  
  drawNeighborhood() {
    buffer.fillStyle = 'rgba(0, 0, 0, 0.5)';
    buffer.beginPath();
    buffer.arc(this.position.x, this.position.y, this.range, 0, Math.PI * 2);
    buffer.fill();
  }
  
  inNeighborhood(player) {
    return player.position.sub(this.position).magnitude() < this.range;
  }
  
  avoid(players) {
    let avoidance = new Vector2();
    for (let player of players) {
      if (player.team.color !== this.team.color && this.inNeighborhood(player)) {
        avoidance = avoidance.add(this.position.sub(player.position).normalize());
      }
    }
    this.avoidance = avoidance.normalize(5);
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
  position: new Vector2(buffer.canvas.width / 2, buffer.canvas.height / 2),
  speed: 10,
  size: 15,
  shooting: false,
  bouncingoff: false,
  probability: 0,
  target: new Vector2(),
  move() {
    this.position = this.position.add(this.target.sub(this.position).normalize(this.speed));
  },
  reachTarget() {
    const dist = this.target.sub(this.position).magnitude();

    if (dist < this.size / 1.5) return true;
    else return false;
  },
  isGoal() {
    return Math.random() < bball.probability;
  },
  makeGoal() {
    this.position.set(this.target.x, this.target.y)
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
