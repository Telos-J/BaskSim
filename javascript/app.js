const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const buffer = document.createElement('canvas').getContext('2d');

buffer.canvas.width = 940;
buffer.canvas.height = 500;

const bball = {
    x: buffer.canvas.width / 2,
    y: buffer.canvas.height / 2,
    speed: 10,
    size: 15,
    shooting: false,
};

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

class Player {
    constructor(role, height, weight, back_number, name, x, y, target) {
        this.role = role;
        this.height = height;
        this.weight = weight;
        this.back_number = back_number;
        this.name = name;
        this.x = x;
        this.y = y;
        this.target = target;
        this.hasBall = false;
    }
    shoot(ball) {
        this.hasBall = false;
        ball.shooting = true;
    }
}

function generateTeam() {
    const target1 = {
        x: buffer.canvas.width - 55,
        y: buffer.canvas.height / 2,
    };
    // prettier-ignore
    const team1 = [
        new Player('PG', 185, 86, 11, 'Myron Boyce', 338, 272, target1),
        new Player('SG', 198, 94, 24, 'Adam Chester', 293, 135, target1),
        new Player('SF', 202, 101, 34, 'Daanyal Graves', 101, 423),
        new Player('PF', 208, 111, 21, 'Tyreese Ward', 88, 181, target1),
        new Player('C', 217, 121, 12, 'Donovan Robinson', 154, 341, target1),
    ];

    const target2 = { x: 55, y: buffer.canvas.height / 2 };
    // prettier-ignore
    const team2 = [
        new Player('PG', 184, 89, 7, 'Damion Lee', buffer.canvas.width - 338, 272, target2),
        new Player('SG', 200, 98, 13, 'Chris Paul', buffer.canvas.width - 293, 135, target2),
        new Player('SF', 206, 102, 23, 'Zaire Willams', buffer.canvas.width - 101, 423, target2),
        new Player('PF', 210, 107, 34, 'Giannis Antetokumpo', buffer.canvas.width - 88, 181, target2),
        new Player('C', 216, 128, 54, 'Dwight Howard', buffer.canvas.width - 154, 341, target2),
    ];

    return [team1, team2];
}

// Change this to react
function setDOM(playerDOM, player) {
    // prettier-ignore
    let position = convertToWindowCoord(new Vector2(player.x - 10, player.y - 10));
    const displayDOM = document.querySelector('.display');

    // prettier-ignore
    playerDOM.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';
    playerDOM.innerHTML = player.back_number;

    playerDOM.addEventListener('mouseover', () => {
        displayDOM.style.display = 'block';

        // prettier-ignore
        displayDOM.style.transform = 'translate(' + 
        (position.x - displayDOM.offsetWidth) + 'px, ' + 
        (position.y - displayDOM.offsetHeight) + 'px)';

        // prettier-ignore
        displayDOM.innerHTML = player.name + '<br>' + player.role + 
        '<br>' + player.height + 'cm<br>' + player.weight + 'kg';
    });

    playerDOM.addEventListener('click', () => {
        controlPlayer = player;
    });

    // prettier-ignore
    playerDOM.addEventListener('mouseleave', () => displayDOM.style.display = 'none')
}

function drawTeam(team, color) {
    const playerDOM = document.querySelectorAll('.' + color);

    team.forEach((player, index) => {
        buffer.beginPath();
        buffer.fillStyle = color;
        buffer.arc(player.x, player.y, 10, 0, Math.PI * 2);
        buffer.fill();

        setDOM(playerDOM[index], player);
    });
}

function update() {
    if (controller.up.active) controlPlayer.y -= 2;
    if (controller.down.active) controlPlayer.y += 2;
    if (controller.left.active) controlPlayer.x -= 2;
    if (controller.right.active) controlPlayer.x += 2;
    if (controller.space.active && controlPlayer.hasBall)
        controlPlayer.shoot(bball);

    // Detect when player is able to grab the ball
    let distBall = Math.hypot(
        controlPlayer.x - bball.x,
        controlPlayer.y - bball.y
    );
    if (distBall < bball.size && !bball.shooting) {
        controlPlayer.hasBall = true;
        bball.x = controlPlayer.x;
        bball.y = controlPlayer.y;
    }

    // Update trajectory for ball when shooted
    if (bball.shooting == true) {
        const dx = controlPlayer.target.x - bball.x;
        const dy = controlPlayer.target.y - bball.y;
        const angle = Math.atan2(dy, dx);

        bball.x += bball.speed * Math.cos(angle);
        bball.y += bball.speed * Math.sin(angle);

        // Reset ball position when is a goal
        const distHoop = Math.hypot(
            controlPlayer.target.x - bball.x,
            controlPlayer.target.y - bball.y
        );
        if (distHoop < bball.size / 1.5) {
            bball.shooting = false;
            bball.x = controlPlayer.target.x;
            bball.y = controlPlayer.target.y;
        }
    }
}

function render() {
    drawBackground('#b86125');
    drawCourtLines();
    drawTeam(roster1, 'black');
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

function start() {
    update();
    render();
    window.requestAnimationFrame(start);
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

resize();
start();
