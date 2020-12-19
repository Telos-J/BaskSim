class Attribute {
    constructor(shoot, shoot3, defence, stamina, speed) {
        this.shoot = shoot;
        this.shoot3 = shoot3;
        this.defence = defence;
        this.stamina = stamina;
        this.speed = speed;
    }
}

const centerAttribute = new Attribute(0.45, 0.24, 0.67, 89, 65);
const sforwardAttribute = new Attribute(0.53, 0.31, 0.77, 78, 76);
const pforwardAttribute = new Attribute(0.5, 0.29, 0.75, 81, 70);
const pguardAttribute = new Attribute(0.58, 0.39, 0.85, 71, 83);
const sguardAttribute = new Attribute(0.61, 0.48, 0.79, 90, 83);

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
        this.playerDOM = undefined;
    }

    grabBall(ball) {
        const distance = Math.hypot(this.x - ball.x, this.y - ball.y);
        if (distance < ball.size && !ball.shooting) {
            this.hasBall = true;
            ball.x = this.x;
            ball.y = this.y;
        }
    }

    shoot(ball) {
        this.hasBall = false;
        ball.shooting = true;
        ball.target.x = this.target.x;
        ball.target.y = this.target.y;
        const distHoop = Math.hypot(
            this.x - this.target.x,
            this.y - this.target.y
        );
        if (distHoop > 235.8) ball.probability = this.attribute.shoot3;
        else ball.probability = this.attribute.shoot;
    }
    updateStat({ goal = true, bball_probability }) {
        this.attempt += 1;
        if (goal) {
            if (bball_probability == controlPlayer.attribute.shoot3)
                this.score += 3;
            else this.score += 2;

            this.goals += 1;
        }
        this.shootProb = this.goals / this.attempt;
        console.log('score: ', this.score);
        console.log('shootProb: ', this.shootProb);
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

function update() {
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
            controlPlayer.playerDOM
                .querySelector('svg')
                .classList.remove('flip');
            controlPlayer.x += 5;
            controlPlayer.isMoving = true;
        }
    }
    if (0 < controlPlayer.x) {
        if (controller.left.active) {
            controlPlayer.playerDOM.querySelector('svg').classList.add('flip');
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

    if (!controlPlayer.wasMoving && controlPlayer.isMoving) {
        const paths = Array.from(
            controlPlayer.playerDOM.querySelectorAll('path')
        );
        walkAnimation(paths);
    } else if (controlPlayer.wasMoving && !controlPlayer.isMoving) {
        const paths = Array.from(
            controlPlayer.playerDOM.querySelectorAll('path')
        );
        idleAnimation(paths);
    }

    controlPlayer.grabBall(bball);

    if (bball.shooting) {
        bball.move();
        if (bball.reachTarget()) {
            bball.shooting = false;

            if (bball.isGoal()) {
                bball.makeGoal();
                controlPlayer.updateStat({
                    goal: true,
                    ball_probablity: bball.probability,
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

function render() {
    drawBackground('#b86125');
    drawCourtLines();
    drawTeam(roster1, 'green');
    // drawTeam(roster2, "purple");
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
let controlPlayer = roster1[0];
const engine = new Engine(1000 / 30, update, render);

resize();
engine.start();
