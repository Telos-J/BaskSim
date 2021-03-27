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
        this.wasShooting = false;
        this.range = 100;
        this.coolTime = 0;
        this.avoidOpponentConst = 1;
        this.markOpponentConst = 1;
        this.avoidWallConst = 1.3;
        this.chaseBallConst = 20;
    }

    initState() {
        this.wasMoving = this.isMoving;
        this.hadBall = this.hasBall;
        this.wasShooting = this.isShooting;
        this.velocity.set(0, 0);
    }

    stateChange() {
        return this.wasMoving !== this.isMoving || this.hadBall !== this.hasBall
    }

    control(ball, players) {
        if (ball.isDead) {
            // this.chaseBall(ball);
            this.grabBall(ball);
            this.avoidOpponent(players);
        } else if (this.isDefense(ball)) {
            this.markOpponent(players);
            this.grabBall(ball);
        } else if (this.isOffense(ball)) {
            if (this.hasBall) {
                this.dribble(ball);
                // this.pass(ball, players);
            }
            if (this.hasBall) this.shoot(ball);
            this.avoidOpponent(players);
        }

        this.avoidWall();
        if (this.back_number === 11)
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
        return !ball.flying && distance < ball.size
    }

    grabBall(ball) {
        if (this.nearBall(ball)) {
            if (ball.player) this.steal(ball.player)
            this.hasBall = true;
            ball.player = this;
            ball.isDead = false;
            ball.hideDOM();
        }
    }

    chaseBall(ball) {
        let chaseBall = ball.position.sub(this.position);
        chaseBall = chaseBall.normalize(this.chaseBallConst);
        this.velocity = this.velocity.add(chaseBall);
    }

    steal(player) {
        player.hasBall = false;
        player.isMoving = false;
        player.coolTime = 100;
    }

    dribble(ball) {
        ball.position.set(this.position.x, this.position.y)
        ball.dribbling = true;
    }

    shouldPass(players) {
        let pass = false;
        for (let player of players) {
            const dist = this.position.sub(player.position).magnitude()
            if (this.isOpponent(player) && dist < 50) pass = true;
        }
        return pass
    }

    passTo() {
        const team = this.team.players.filter(
            player => player !== this && !player.coolTime
        )
        const idx = Math.floor(Math.random() * team.length);
        return team[idx];
    }

    pass(ball, players) {
        if (this.shouldPass(players)) {
            const targetPlayer = this.passTo();

            if (targetPlayer) {
                this.hasBall = false;
                ball.passing = true;
                ball.speed = 10;
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

            if (this.isShooting) {
                shootAnimation(fullPaths, this);
            }
            else if (!this.isMoving && !this.hasBall) idleAnimation(paths);
            else if (this.isMoving && !this.hasBall) walkAnimation(paths);
            else if (!this.isMoving && this.hasBall) idleDribbleAnimation(fullPaths);
            else if (this.isMoving && this.hasBall) dribbleAnimation(fullPaths);

            if (this.hasBall) ball.style.display = "block";
            else ball.style.display = "none";
        }
    }

    shouldShoot(dist) {
        let shouldShoot = false;
        if (dist > 100 && dist < 300) shouldShoot = true;

        return shouldShoot;
    }

    shoot(ball) {
        const dist = this.target.sub(this.position).magnitude();

        if (this.shouldShoot(dist)) {
            this.hasBall = false;
            this.isShooting = true;
            this.coolTime = 50;

            ball.flying = true;
            ball.speed = 23;
            const angle = Math.PI / 3;
            ball.velocity = this.target.sub(this.position).normalize(ball.speed * Math.cos(angle));
            ball.ySpeed = ball.speed * Math.sin(angle);
            ball.yPosition = 0;
            ball.showDOM();
            ball.isDead = true;
            ball.inBasket = false;
            ball.bouncingOff = false;
            ball.dribbling = false;

            if (dist > 235.8) ball.probability = this.attribute.shoot3;
            else ball.probability = this.attribute.shoot;
        }
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
    }

    updateDOM() {
        if (this.isShooting) {
            if (this.target.x < buffer.canvas.width / 2)
                this.playerDOM.classList.add("flip");
            else
                this.playerDOM.classList.remove("flip");
        } else {
            if (this.velocity.x < 0)
                this.playerDOM.classList.add("flip");
            else if (this.velocity.x > 0)
                this.playerDOM.classList.remove("flip");
        }

        if (this.hasBall) this.playerDOM.querySelector("#dribbleBall").style.display = "block";
        else this.playerDOM.querySelector("#dribbleBall").style.display = "none";

        this.playerDOM.style.zIndex = Math.floor(this.position.y);

        let position = new Vector2(...perspectiveTransform(this.position.x, buffer.canvas.height - this.position.y))
        position = convertToWindowCoord(position);
        this.playerDOM.style.transform =
            "translate(" + (position.x - 40) + "px, " + (position.y - 65) + "px)";
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

    drawPosition() {
        buffer.fillStyle = this.team.color;
        buffer.beginPath();
        buffer.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
        buffer.fill();
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

    markOpponent(players) {
        for (let player of players) {
            if (this.isOpponent(player) && player.role === this.role) {
                const mark = player.position.sub(this.position).normalize(this.markOpponentConst)
                this.velocity = this.velocity.add(mark)
            }
        }
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

        if (this.position.x < this.range) avoidance.x = this.range / this.position.x;
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

export class Hoop {
    constructor(x, y) {
        this.position = new Vector2(x, y);
    }
}

export const leftHoop = new Hoop(55, buffer.canvas.height / 2)
export const rightHoop = new Hoop(buffer.canvas.width - 55, buffer.canvas.height / 2)

export const ball = {
    DOM: document.querySelector("#basketball"),
    position: new Vector2(buffer.canvas.width / 2, buffer.canvas.height / 2),
    velocity: new Vector2(),
    yPosition: 0,
    speed: 10,
    ySpeed: 0,
    gravity: 1,
    friction: 0.1,
    size: 15,
    flying: false,
    passing: false,
    probability: 0,
    target: new Vector2(),
    player: undefined,
    isDead: true,
    inBasket: false,
    bouncingOff: false,
    dribbling: false,

    move() {
        this.position = this.position.add(this.velocity);
        this.ySpeed -= this.gravity;
        this.yPosition += this.ySpeed;

        this.bound()
        this.collideBackboard()

        if (this.yPosition === 0 && this.velocity.magnitude())
            this.applyFriction();

        if (this.dribbling)
            this.position = this.player.position
    },

    reset() {
        this.position = new Vector2(buffer.canvas.width / 2, buffer.canvas.height / 2);
        this.velocity = new Vector2();
        this.yPosition = 0;
        this.speed = 10;
        this.ySpeed = 0;
        this.flying = false;
        this.passing = false;
        this.target = new Vector2();
        this.player = undefined;
        this.isDead = true;
    },

    bound() {
        if (this.position.x > buffer.canvas.width + 200 ||
            this.position.y > buffer.canvas.height ||
            this.position.x < -200 ||
            this.position.y < 0) this.reset();

        if (this.yPosition < 0) {
            this.yPosition = 0;
            this.flying = false;
            this.ySpeed = -this.ySpeed * 0.5;
        }

    },

    applyFriction() {
        this.velocity = this.velocity.sub(this.velocity.normalize(this.friction));
        if (this.velocity.magnitude() < this.friction) this.velocity.set(0, 0)
    },

    reachTarget() {
        const dist = this.target.sub(this.position).magnitude();

        if (!this.reachedTarget && dist < this.size / 1.5) {
            this.position.set(this.target.x, this.target.y);
            return true;
        }
        else return false;
    },

    isGoal() {
        return Math.random() < this.probability;
    },

    makeGoal(hoop) {
        console.log('goal')
        if (this.player) this.player.updateStat({
            goal: true,
            ball_probability: this.probability,
        });
        this.position.set(hoop.position.x, hoop.position.y);
        this.velocity.set(0, 0);
        this.ySpeed = 0;
        this.inBasket = true;
        this.player = undefined;
    },

    bounceoff(hoop) {
        console.log('bounceoff')
        if (this.player) this.player.updateStat({ goal: false });
        this.bouncingOff = true;
        this.ySpeed = -this.ySpeed;
        this.speed = 3;
        this.player = undefined;

        const angle = Math.random() * Math.PI + (Math.PI * 3) / 2;

        if (hoop.position.x > buffer.canvas.width / 2) {
            this.velocity.set(-this.speed * Math.cos(angle), this.speed * Math.sin(angle));
        } else {
            this.velocity.set(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
        }
    },

    checkGoal() {
        for (let hoop of [leftHoop, rightHoop]) {
            if (!this.inBasket && !this.bouncingOff && Math.abs(this.yPosition - 170) < this.size && this.ySpeed < 0 &&
                this.position.sub(hoop.position).magnitude() < this.size) {

                if (this.isGoal()) {
                    this.makeGoal(hoop);
                } else {
                    this.bounceoff(hoop);
                }
            }
        }
    },

    collideBackboard() {
        if (this.yPosition > 170 + this.size &&
            (this.position.sub(leftHoop.position).magnitude() < this.size ||
                this.position.sub(rightHoop.position).magnitude() < this.size)) {
            this.velocity = this.velocity.scale(-1)
        }
    },

    updateState() {
        const target1 = new Vector2(buffer.canvas.width - 55, buffer.canvas.height / 2);
        const target2 = new Vector2(55, buffer.canvas.height / 2);
        if (this.reachTarget()) {
            if (this.flying && Math.abs(this.yPosition - 170) < 10) {
                if (this.player) this.checkGoal()
                this.player = undefined;
                this.isDead = true;
            }
            else if (this.passing) {
                this.passing = false;
            }
        }
    },

    updateDOM() {
        let position = new Vector2(...perspectiveTransform(
            this.position.x, buffer.canvas.height - this.position.y, this.yPosition)
        )
        this.DOM.style.zIndex = Math.floor(this.position.y);
        position = convertToWindowCoord(position)

        document.querySelector('#pin').style.transform =
            "translate(" + (position.x - 2.5) + "px, " + (position.y - 2.5) + "px)";

        this.DOM.style.transform =
            "translate(" + (position.x - 10) + "px, " + (position.y - 10) + "px)";
    },

    showDOM() {
        this.DOM.style.display = 'block';
    },

    hideDOM() {
        this.DOM.style.display = 'none';
    },

    update() {
        this.move();
        this.checkGoal();
        this.updateState();
        this.updateDOM();
    },

    drawPosition() {
        buffer.fillStyle = 'orange';
        buffer.beginPath();
        buffer.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
        buffer.fill();
    }
};
