import {
  idleDribbleAnimation,
  dribbleAnimation,
  walkAnimation,
  idleAnimation,
  shootAnimation,
} from "./animation.js";

export class Attribute {
  constructor(shoot, shoot3, defence, stamina, speed) {
    this.shoot = shoot;
    this.shoot3 = shoot3;
    this.defence = defence;
    this.stamina = stamina;
    this.speed = speed;
  }
}

export class Player {
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
    this.hadBall = false;
    this.graball = false;
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
    this.coolTime = 0;
    this.avoidOpponentConst = 1;
    this.avoidWallConst = 1.3;
    this.chaseBallConst = 20;
  }

  initState() {
    this.wasMoving = this.isMoving;
    this.hadBall = this.hasBall;
    this.velocity.set(0, 0);
  }

  stateChange() {
    return this.wasMoving !== this.isMoving || this.hadBall !== this.hasBall
  }

  control(ball, players) {
    if (ball.isDead || this.isDefense(ball)) {
      this.chaseBall(ball);
      this.grabBall(ball);
    } else if (this.isOffense(ball)) {
      if (this.hasBall) {
        this.dribble(ball);
        this.pass(ball, players);
      }
      this.avoidOpponent(players);
    } 

    this.avoidWall();
    this.move();
  }

  move() {
    this.isMoving = this.velocity.magnitude() ? true : false;
    if (this.isMoving) {
      this.velocity = this.velocity.normalize(this.attribute.speed)
      this.position = this.position.add(this.velocity)
    }
  }

  nearBall(ball) {
    const distance = this.position.sub(ball.position).magnitude();
    return !ball.shooting && distance < ball.size
  }

  grabBall(ball) {
    if (this.nearBall(ball)) {
      if (ball.player) this.steal(ball.player)
      this.hasBall = true;
      ball.player = this;
      ball.isDead = false;
    }
  }

  steal(player) {
    player.hasBall = false;
    player.isMoving = false;
    player.coolTime = 100;
    player.animate()
  }

  dribble(ball) {
    ball.position.set(this.position.x, this.position.y)
  }

  determinePass(players) {
    let pass = false;
    for (let player of players) {
      const dist = this.position.sub(player.position).magnitude()
      if (this.isOpponent(player) && dist < 50) pass = true;
    }
    return pass
  }

  pass(ball, players) {
    if (this.determinePass(players)) {
      const team = this.team.players.filter(player => player !== this)
      const idx = Math.floor(Math.random() * team.length);
      const targetPlayer = team[idx];

      if (targetPlayer) {
        this.hasBall = false;
        ball.passing = true;
        ball.target = targetPlayer.position;
        ball.position = ball.position.add(ball.target.sub(ball.position).normalize(this.attribute.speed * 2))
        ball.isDead = true;
      }
    }
  }

  animate() {
    if (this.stateChange()) {
      const character = this.playerDOM.querySelector("#character");
      const ball = this.playerDOM.querySelector('#dribbleBall');
      const paths = Array.from(character.querySelectorAll("path"));
      const fullPaths = Array.from(this.playerDOM.querySelectorAll("path"));

      if (!this.isMoving && !this.hasBall) idleAnimation(paths);
      else if (this.isMoving && !this.hasBall) walkAnimation(paths);
      else if (!this.isMoving && this.hasBall) idleDribbleAnimation(fullPaths);
      else if (this.isMoving && this.hasBall) dribbleAnimation(fullPaths);
      
      if (this.hasBall) ball.style.display = "block";
      else ball.style.display = "none";
    }
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
  }

  update() {
    this.coolTime = this.coolTime-- > 0 ? this.coolTime : 0;
    this.updateDOM()
  }

  updateStat({ goal, ball_probability }) {
    this.attempt += 1;
    if (goal) {
      if (ball_probability == this.attribute.shoot3) {
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

  updateDOM() {
    if (this.velocity.x > 0) this.playerDOM.classList.remove("flip");
    else if (this.velocity.x < 0) this.playerDOM.classList.add("flip");

    this.playerDOM.style.zIndex = this.position.y;

    let position = convertToWindowCoord(
      this.playerDOM.querySelector("svg").classList.contains("flip")
        ? this.position.sub(new Vector2(20, 20))
        : this.position.sub(new Vector2(40, 20))
    );

    this.playerDOM.style.transform =
      "translate(" + position.x + "px, " + position.y + "px)";
  }

  isOpponent(player) {
    return player.team.color !== this.team.color
  }

  isDefense(ball) {
    return this.isOpponent(ball.player)
  }

  isOffense(ball) {
    return !this.isOpponent(ball.player)
  }

  chaseBall(ball) {
    let chaseBall = ball.position.sub(this.position);
    chaseBall = chaseBall.normalize(this.chaseBallConst);
    this.velocity = this.velocity.add(chaseBall);
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

  avoidOpponent(players) {
    let avoidance = new Vector2();

    for (let player of players)
      if (this.isOpponent(player) && this.inNeighborhood(player)) {
        let vectToOpponent = this.position.sub(player.position);

        vectToOpponent = vectToOpponent.normalize(this.range / vectToOpponent.magnitude())
        avoidance = avoidance.add(vectToOpponent);
      }

    avoidance = avoidance.scale(this.avoidOpponentConst);
    this.velocity = this.velocity.add(avoidance);
  }

  avoidWall() {
    let avoidance = new Vector2();

    if (this.position.x < this.range) avoidance.x =  this.range / this.position.x;
    if (this.position.y < this.range) avoidance.y = this.range / this.position.y;
    if (this.position.x > buffer.canvas.width - this.range) 
      avoidance.x = -this.range / (buffer.canvas.width - this.position.x);
    if (this.position.y > buffer.canvas.height - this.range)
      avoidance.y = -this.range / (buffer.canvas.height - this.position.y);

    avoidance = avoidance.scale(this.avoidWallConst);
    this.velocity = this.velocity.add(avoidance);
  }
}

export class Team {
  constructor(players, color) {
    this.players = players;
    this.color = color;
    this.score = 0;
  }
}

export const ball = {
  DOM: document.querySelector("#basketball"),
  position: new Vector2(buffer.canvas.width / 2, buffer.canvas.height / 2),
  speed: 10,
  size: 15,
  shooting: false,
  bouncingoff: false,
  passing: false,
  probability: 0,
  target: new Vector2(),
  player: undefined,
  isDead: true,

  move() {
    this.position = this.position.add(this.target.sub(this.position).normalize(this.speed));
  },
  
  reachTarget() {
    const dist = this.target.sub(this.position).magnitude();

    if (dist < this.size / 1.5) return true;
    else return false;
  },

  isGoal() {
    return Math.random() < this.probability;
  },

  makeGoal() {
    this.position.set(this.target.x, this.target.y)
    this.player.updateStat({
      goal: true,
      ball_probability: this.probability,
    });
  },

  bounceoff() {
    this.bouncingoff = true;
    this.player.updateStat({ goal: false });

    const angle = Math.random() * Math.PI + (Math.PI * 3) / 2;

    if (this.target.x > buffer.canvas.width / 2) {
      this.target.x = this.target.x - 80 * Math.cos(angle);
      this.target.y = this.target.y + 80 * Math.sin(angle);
    } else {
      this.target.x = this.target.x + 80 * Math.cos(angle);
      this.target.y = this.target.y + 80 * Math.sin(angle);
    }
  },

  checkGoal() {
    if (this.isGoal()) {
      this.makeGoal();
    } else {
      this.bounceoff();
    }
  },

  updatePosition() {
    if (this.shooting || this.bouncingoff) this.move()
    if (this.passing) this.move()
  },

  updateState() {
    if (this.reachTarget()) {
      if (this.shooting) {
        this.shooting = false;
        this.checkGoal();
      }
      else if (this.bouncingoff) {
        this.bouncingoff = false;
        this.player = undefined;
        this.isDead = true;
      }
      else if (this.passing) {
        this.passing = false;
      }
    }
  },

  updateDOM() {
    let position = convertToWindowCoord(ball.position.sub(new Vector2(15, 15)))
    if (this.isDead || this.shooting || this.bouncingoff) this.DOM.style.display = 'block';
    else this.DOM.style.display = 'none';

    this.DOM.style.transform =
      "translate(" + position.x + "px, " + position.y + "px)";
  },

  update() {
    this.updatePosition();
    this.updateState();
    this.updateDOM();
  }
};
