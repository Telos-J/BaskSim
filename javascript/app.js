const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const buffer = document.createElement('canvas').getContext('2d');

buffer.canvas.width = 940;
buffer.canvas.height = 500;

function resize() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const width_height_ratio = 9 / 16;

    // Set display size (css pixels).
    if (height / width > width_height_ratio) {
        canvas.style.width = width + 'px';
        canvas.style.height = width * width_height_ratio + 'px';
    } else {
        canvas.style.width = height / width_height_ratio + 'px';
        canvas.style.height = height + 'px';
    }

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;
}

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

function update() {}

function render() {
    drawBackground('#b86125');
    drawCourtLines();

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

window.addEventListener('resize', resize);

resize();
start();
