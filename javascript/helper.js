class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(...vectors) {
        const sum = new Vector2();

        for (let vector of vectors) {
            sum.x += vector.x;
            sum.y += vector.y;
        }
        return sum;
    }

    add(...vectors) {
        const sum = new Vector2(this.x, this.y);

        for (let vector of vectors) {
            sum.x += vector.x;
            sum.y += vector.y;
        }
        return sum;
    }

    sub(...vectors) {
        const result = new Vector2(this.x, this.y);

        for (let vector of vectors) {
            result.x -= vector.x;
            result.y -= vector.y;
        }
        return result;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    scale(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    normalize(value = 1) {
        if (this.magnitude() !== 0) {
            return this.scale(value / this.magnitude());
        } else {
            return new Vector2();
        }
    }
}

const angleToVector = function (angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
};

const vectorToAngle = function (vector) {
    return Math.atan2(vector.y, vector.x);
};

const resize = function () {
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;
    const width_height_ratio = 9 / 16;

    if (height / width > width_height_ratio)
        height = width * width_height_ratio;
    else width = height / width_height_ratio;

    // Set display size (css pixels).
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;
};

const handleMouseMove = function (event) {
    mousePos = convertToBufferCoord(new Vector2(event.clientX, event.clientY));
};

const convertToBufferCoord = function (vector) {
    return new Vector2(
        ((vector.x - canvas.offsetLeft) /
            (canvas.width / window.devicePixelRatio)) *
            buffer.canvas.width,
        ((vector.y - canvas.offsetTop) /
            (canvas.height / window.devicePixelRatio)) *
            buffer.canvas.height
    );
};

const convertToWindowCoord = function (vector) {
    return new Vector2(
        (vector.x / buffer.canvas.width) *
            (canvas.width / window.devicePixelRatio) +
            canvas.offsetLeft,
        (vector.y / buffer.canvas.height) *
            (canvas.height / window.devicePixelRatio) +
            canvas.offsetTop
    );
};

let mousePos = new Vector2();
