const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const buffer = document.createElement('canvas').getContext('2d');

buffer.canvas.width = 940;
buffer.canvas.height = 500;

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
        this.target.x = this.target.x - 80 * Math.cos(angle);
        this.target.y = this.target.y + 80 * Math.sin(angle);
    },
};

let score = 0;
let attempt = 0;
let made = 0;
let shootProb = 0;

function drawBackground(color) {
    buffer.fillStyle = color;
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
}

function draw_sideline() {
    buffer.strokeRect(0, 0, buffer.canvas.width, buffer.canvas.height);
}

function draw_halfline() {
    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width / 2, 0);
    buffer.lineTo(buffer.canvas.width / 2, buffer.canvas.height);
    buffer.stroke();
}

function draw_centercircle() {
    buffer.beginPath();
    buffer.arc(
        buffer.canvas.width / 2,
        buffer.canvas.height / 2,
        20,
        0,
        2 * Math.PI
    );
    buffer.stroke();
    buffer.beginPath();
    buffer.arc(
        buffer.canvas.width / 2,
        buffer.canvas.height / 2,
        60,
        0,
        2 * Math.PI
    );
    buffer.stroke();
}

function draw_hoop() {
    buffer.beginPath();
    buffer.arc(55, buffer.canvas.height / 2, 15, 0, 2 * Math.PI);
    buffer.stroke();
    buffer.beginPath();
    buffer.arc(
        buffer.canvas.width - 55,
        buffer.canvas.height / 2,
        15,
        0,
        2 * Math.PI
    );
    buffer.stroke();
}

function draw_backboard() {
    buffer.beginPath();
    buffer.moveTo(40, buffer.canvas.height / 2 - 30);
    buffer.lineTo(40, buffer.canvas.height / 2 + 30);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 40, buffer.canvas.height / 2 - 30);
    buffer.lineTo(buffer.canvas.width - 40, buffer.canvas.height / 2 + 30);
    buffer.stroke();
}

function draw_nocharge_circle() {
    buffer.beginPath();
    buffer.moveTo(40, buffer.canvas.height / 2 - 40);
    buffer.lineTo(52.6, buffer.canvas.height / 2 - 40);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(40, buffer.canvas.height / 2 + 40);
    buffer.lineTo(52.6, buffer.canvas.height / 2 + 40);
    buffer.stroke();
    buffer.beginPath();
    buffer.arc(
        52.6,
        buffer.canvas.height / 2,
        40,
        (Math.PI * 3) / 2,
        (Math.PI * 5) / 2
    );
    buffer.stroke();

    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 40, buffer.canvas.height / 2 - 40);
    buffer.lineTo(buffer.canvas.width - 52.6, buffer.canvas.height / 2 - 40);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 40, buffer.canvas.height / 2 + 40);
    buffer.lineTo(buffer.canvas.width - 52.6, buffer.canvas.height / 2 + 40);
    buffer.stroke();
    buffer.beginPath();
    buffer.arc(
        buffer.canvas.width - 52.6,
        buffer.canvas.height / 2,
        40,
        Math.PI / 2,
        (Math.PI * 3) / 2
    );
    buffer.stroke();
}

function draw_bball() {
    const image = new Image();
    image.src = 'assets/bball_flat_icon.png';
    buffer.drawImage(image, 0, 0, 860, 907, bball.x - 15, bball.y - 15, 30, 30);
}

function draw_threepointline() {
    buffer.beginPath();
    buffer.moveTo(0, 30);
    buffer.lineTo(140, 30);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(0, buffer.canvas.height - 30);
    buffer.lineTo(140, buffer.canvas.height - 30);
    buffer.stroke();
    buffer.beginPath();
    buffer.arc(
        55,
        buffer.canvas.height / 2,
        236,
        Math.atan2(-220, 140 - 56),
        Math.atan2(220, 140 - 56)
    );
    buffer.stroke();

    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 140, 30);
    buffer.lineTo(buffer.canvas.width, 30);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 140, buffer.canvas.height - 30);
    buffer.lineTo(buffer.canvas.width, buffer.canvas.height - 30);
    buffer.stroke();
    buffer.arc(
        buffer.canvas.width - 55,
        buffer.canvas.height / 2,
        235.8,
        Math.atan2(220, -140 + 57),
        Math.atan2(-220, -140 + 57)
    );
    buffer.stroke();
}

function draw_freethrowline() {
    buffer.beginPath();
    buffer.moveTo(0, 190);
    buffer.lineTo(190, 190);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(0, buffer.canvas.height - 190);
    buffer.lineTo(190, buffer.canvas.height - 190);
    buffer.stroke();

    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 190, 190);
    buffer.lineTo(buffer.canvas.width, 190);
    buffer.stroke();
    buffer.beginPath();
    buffer.moveTo(buffer.canvas.width - 190, buffer.canvas.height - 190);
    buffer.lineTo(buffer.canvas.width, buffer.canvas.height - 190);
    buffer.stroke();
}

function dashArc(context, numDashes, x, y, radius, startAngle, endAngle) {
    let stepAngle = (endAngle - startAngle) / (2 * numDashes);
    stepAngle = (endAngle + stepAngle - startAngle) / (2 * numDashes); // End in a dash

    for (i = 0; i < numDashes; i++) {
        context.beginPath();
        context.arc(
            x,
            y,
            radius,
            startAngle + stepAngle * (2 * i),
            startAngle + stepAngle * (2 * i + 1)
        );
        context.stroke();
    }
}

function draw_freethrowcircle() {
    buffer.beginPath();
    buffer.arc(
        190,
        buffer.canvas.height / 2,
        60,
        (Math.PI * 3) / 2,
        (Math.PI * 5) / 2
    );
    buffer.stroke();
    dashArc(
        buffer,
        8,
        190,
        buffer.canvas.height / 2,
        60,
        Math.PI / 2,
        (Math.PI * 3) / 2
    );

    buffer.beginPath();
    buffer.arc(
        buffer.canvas.width - 190,
        buffer.canvas.height / 2,
        60,
        Math.PI / 2,
        (Math.PI * 3) / 2
    );
    buffer.stroke();
    dashArc(
        buffer,
        8,
        buffer.canvas.width - 190,
        buffer.canvas.height / 2,
        60,
        (Math.PI * 3) / 2,
        (Math.PI * 5) / 2
    );
}

function draw_key() {
    buffer.strokeRect(0, 170, 190, 160);
    buffer.strokeRect(buffer.canvas.width - 190, 170, 190, 160);
}

function drawCourtLines() {
    buffer.strokeStyle = 'black';
    buffer.lineWidth = 10;
    draw_sideline();

    buffer.lineWidth = 5;
    draw_halfline();
    draw_centercircle();
    draw_threepointline();
    draw_freethrowline();
    draw_freethrowcircle();
    draw_key();

    buffer.lineWidth = 2;
    draw_hoop();
    draw_backboard();
    draw_nocharge_circle();
}

function generateTeam() {
    const target1 = {
        x: buffer.canvas.width - 55,
        y: buffer.canvas.height / 2,
    };
    // prettier-ignore
    const team1 = [
        new Player('PG', 185, 86, 11, 'Myron Boyce', 338, 272, target1,pguardAttribute),
        new Player('SG', 198, 94, 24, 'Adam Chester', 293, 135, target1,sguardAttribute),
        new Player('SF', 202, 101, 34, 'Daanyal Graves', 101, 423,sforwardAttribute),
        new Player('PF', 208, 111, 21, 'Tyreese Ward', 88, 181, target1,pforwardAttribute),
        new Player('C', 217, 121, 12, 'Donovan Robinson', 154, 341, target1,centerAttribute),
    ];

    const team1DOM = document.querySelectorAll('.green');
    team1.forEach((player, index) => {
        setDOM(team1DOM[index], player);
    });

    const target2 = { x: 55, y: buffer.canvas.height / 2 };
    // prettier-ignore
    const team2 = [
        new Player('PG', 184, 89, 7, 'Damion Lee', buffer.canvas.width - 338, 272, target2,pguardAttribute),
        new Player('SG', 200, 98, 13, 'Chris Paul', buffer.canvas.width - 293, 135, target2,sguardAttribute),
        new Player('SF', 206, 102, 23, 'Zaire Willams', buffer.canvas.width - 101, 423, target2,sforwardAttribute),
        new Player('PF', 210, 107, 34, 'Giannis Antetokumpo', buffer.canvas.width - 88, 181, target2,pforwardAttribute),
        new Player('C', 216, 128, 54, 'Dwight Howard', buffer.canvas.width - 154, 341, target2,centerAttribute),
    ];

    return [team1, team2];
}

function setDOM(playerDOM, player) {
    const displayDOM = document.querySelector('.display');

    playerDOM.getElementsByClassName('number')[0].innerHTML =
        player.back_number;

    playerDOM.addEventListener('mouseover', (e) => {
        displayDOM.style.display = 'block';
        displayDOM.style.transform =
            'translate(' + (e.clientX + 20) + 'px, ' + (e.clientY + 20) + 'px)';
        displayDOM.innerHTML =
            player.name +
            '<br>' +
            player.role +
            '<br>' +
            player.height +
            'cm<br>' +
            player.weight +
            'kg';
    });

    playerDOM.addEventListener('click', () => {
        controlPlayer = player;
    });

    playerDOM.addEventListener(
        'mouseleave',
        () => (displayDOM.style.display = 'none')
    );
}

function drawTeam(team, color) {
    const playerDOM = document.querySelectorAll('.' + color);

    team.forEach((player, index) => {
        let position = convertToWindowCoord(
            new Vector2(player.x - 20, player.y - 20)
        );

        playerDOM[index].style.transform =
            'translate(' + position.x + 'px, ' + position.y + 'px)';
    });
}

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
            controlPlayer.x += 5;
            controlPlayer.isMoving = true;
        }
    }
    if (0 < controlPlayer.x) {
        if (controller.left.active) {
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
        walk_timeline.play();
    } else if (controlPlayer.wasMoving && !controlPlayer.isMoving) {
        walk_timeline.pause();
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

function keyDownUp(event) {
    controller.keyDownUp(event.type, event.keyCode);
}

window.addEventListener('resize', resize);
window.addEventListener('keydown', keyDownUp);
window.addEventListener('keyup', keyDownUp);
canvas.addEventListener('mousemove', handleMouseMove);

const [roster1, roster2] = generateTeam();
let controlPlayer = roster1[0];
const controller = new Controller();
const engine = new Engine(1000 / 30, update, render);

resize();
engine.start();
