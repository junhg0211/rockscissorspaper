const fps = 60;
const size = 50;
const speed = 2;
const threshold = 500;
const gravity = 50;
const boardSize = 20;

let canvas;
let context;

let objects = [];

function tick() {
    for (let i = 0; i < objects.length; i++) {
        let me = objects[i];

        // moving
        let vx = 0;
        let vy = 0;
        let count = 0;

        for (let j = 0; j < objects.length; j++) {
            // if same thing, skip
            if (i == j) {
                continue;
            }

            let other = objects[j];

            // if distance > threshold, skip
            let hostile = (me[2] - other[2] + 3) % 3;
            if (hostile == 2) {
                hostile = -3; // attack
            } else if (hostile == 1) {
                hostile = 1; // escape
            } else {
                hostile = 0.5;
            }

            let dx = me[0] - other[0];
            let dy = me[1] - other[1];
            let distance = Math.hypot(dx, dy);
            if (distance > threshold) {
                continue;
            }

            // infection!
            if (hostile == 1 && distance < size) {
                me[2] = other[2];
                continue;
            }

            // move
            let angle = Math.atan2(dy, dx);

            vx += Math.cos(angle) * hostile;
            vy += Math.sin(angle) * hostile;
            count++;
        }

        // get them to center
        let cx = canvas.width/2 - me[0];
        let cy = canvas.height/2 - me[1];
        let cd = Math.hypot(cx, cy);
        let ct = Math.atan2(cy, cx);

        if (cd > size * boardSize) {
            me[0] = canvas.width/2;
            me[1] = canvas.height/2;
        }

        if (count == 0) {
            continue;
        }

        vx /= count;
        vy /= count;

        me[0] += vx * speed;
        me[1] += vy * speed;
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(obj => {
        let [x, y, kind] = obj;

        // set color
        let text;
        let color;
        if (kind == 0) {
            text = "묵";
            color = "red";
        } else if (kind == 1) {
            text = "찌";
            color = "green";
        } else {
            text = "빠";
            color = "blue";
        }

        // draw
        context.font = `${size}px serif`;
        context.fillStyle = color;
        context.fillText(text, x, y);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // load canvas
    canvas = document.querySelector("#canvas");
    context = canvas.getContext("2d");
    resize();

    // add objects
    for (let i = 0; i < 300; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let type = Math.floor(Math.random() * 3);

        objects.push([x, y, type]);
    }

    // start main loop
    setInterval(() => {
        tick();
        render();
    }, 1000 / fps);
});

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
