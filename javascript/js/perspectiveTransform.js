let d = (383 / (470 - 383)) * 500
let h = 144 * (d + 500) / 500

function perspectiveTransform(x, z) {
    x = x - 940 / 2
    z = z + d
    let xt = (d / z) * x
    let yt = ((z - d) / z) * h

    xt += 940 / 2
    yt = height - yt

    return [xt, yt]
}

function addPadding(foo) {
    context.save()
    context.translate(padding, padding)
    foo()
    context.restore()
}

function drawBackground() {
    context.clearRect(0,0,canvas.width, canvas.height)
}

function drawSidelines() {
    context.beginPath()
    context.moveTo(...perspectiveTransform(0, 0))
    context.lineTo(...perspectiveTransform(940, 0))
    context.lineTo(...perspectiveTransform(940, 500))
    context.lineTo(...perspectiveTransform(0, 500))
    context.lineTo(...perspectiveTransform(0, 0))
    context.stroke()
}

function drawCenterCircle() {
    for (let i=0; i<Math.PI*2; i+=0.1) {
        context.beginPath()
        const [x, y] = perspectiveTransform(
            470 + 60 * Math.cos(i),
            250 + 60 * Math.sin(i)
        )
        context.arc(x, y, 1, 0, Math.PI*2)
        context.fill()
    }
}

function drawThreePointCircle() {
    for (let j of [30, 470])
    for (let i=0; i<140; i+=5) {
        context.beginPath()
        let [x1, y1] = perspectiveTransform(i, j)
        context.arc(x1, y1, 1, 0, Math.PI*2)
        context.fill()

        context.beginPath()
        let [x2, y2] = perspectiveTransform(940 - i, j)
        context.arc(x2, y2, 1, 0, Math.PI*2)
        context.fill()
    }

    for (let i=Math.atan2(-220, 84); i<Math.atan2(220, 84); i+=0.05) {
        context.beginPath()
        const [x, y] = perspectiveTransform(
            55 + 236 * Math.cos(i),
            250 + 236 * Math.sin(i)
        )
        context.arc(x, y, 1, 0, Math.PI*2)
        context.fill()
    }

    for (let i=Math.atan2(220, -84); i<Math.PI*2 + Math.atan2(-220, -84); i+=0.05) {
        context.beginPath()
        const [x, y] = perspectiveTransform(
            940 - 55 + 236 * Math.cos(i),
            250 + 236 * Math.sin(i)
        )
        context.arc(x, y, 1, 0, Math.PI*2)
        context.fill()
    }
}

function drawFreeThow() {
    for (let j of [190, 750])
    for (let i=0; i<Math.PI*2; i+=0.1) {
        context.beginPath()
        const [x, y] = perspectiveTransform(
            j + 60 * Math.cos(i),
            250 + 60 * Math.sin(i)
        )
        context.arc(x, y, 1, 0, Math.PI*2)
        context.fill()
    }

    for (let j of [190, 310])
    for (let i=0; i<190; i+=5) {
        context.beginPath()
        let [x1, y1] = perspectiveTransform(i, j)
        context.arc(x1, y1, 1, 0, Math.PI*2)
        context.fill()

        context.beginPath()
        let [x2, y2] = perspectiveTransform(940 - i, j)
        context.arc(x2, y2, 1, 0, Math.PI*2)
        context.fill()
    }
}

function draw() {
    drawBackground()
    addPadding(() => {
        context.fillStyle = 'black'
        context.strokeStyle = 'black'
        context.lineWidth = 2

        drawSidelines()
        drawCenterCircle()
        drawThreePointCircle()
        drawFreeThow()
    })
}

draw()
