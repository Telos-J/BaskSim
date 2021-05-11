class Controller {
    constructor() {
        this.arrowUp = false;
        this.arrowDown = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.space = false;
    }

    keydown(e) {
        if (e.code === 'ArrowUp') this.arrowUp = true;
        else if (e.code === 'ArrowDown') this.arrowDown = true;
        else if (e.code === 'ArrowLeft') this.arrowLeft = true;
        else if (e.code === 'ArrowRight') this.arrowRight = true;
        else if (e.code === 'Space') this.space = true;
    }

    keyup(e) {
        if (e.code === 'ArrowUp') this.arrowUp = false;
        else if (e.code === 'ArrowDown') this.arrowDown = false;
        else if (e.code === 'ArrowLeft') this.arrowLeft = false;
        else if (e.code === 'ArrowRight') this.arrowRight = false;
        else if (e.code === 'Space') this.space = false;
    }

}
