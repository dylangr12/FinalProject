

let waveOffset = 0;
let trees = [];
let sandDots = [];
let sunX, sunY;
let sunVisible = true; 
let isSunset = true;
let horizonY = 400;
let sailboatX;
let sailboatMoving = false;
let sailboatInitialX;
let isMovingLeft = false;
let currentCastleColor;

function setup() {
    createCanvas(800, 600);
    sunX = width - 100; 
    sunY = height - 170;  

    trees.push(new PalmTree(100, height - 50));
    trees.push(new PalmTree(width - 100, height - 50));

    for (let i = 0; i < 300; i++) {
        sandDots.push({
            x: random(width),
            y: random(height - 150, height)
        });
    }

    sailboatInitialX = width / 2 + 200;
    sailboatX = sailboatInitialX;

    currentCastleColor = color(random(255), random(255), random(255));
}

function draw() {
    drawBackground();
    drawSun();
    drawWaves();
    drawSand();
    drawSandcastle();
    drawSailboat();
    for (let tree of trees) {
        tree.display();
        tree.sway();
    }

    if (sailboatMoving) {
        if (isMovingLeft) {
            sailboatX -= 1;
            if (sailboatX <= sailboatInitialX - 200) {
                sailboatMoving = false;
                sailboatX = sailboatInitialX - 200;
            }
        } else {
            sailboatX += 1;
            if (sailboatX >= sailboatInitialX) {
                sailboatMoving = false;
                sailboatX = sailboatInitialX;
            }
        }
    }
}

function drawBackground() {
    if (isSunset) {
        let sunsetColors = [
            color(255, 87, 34),
            color(255, 120, 60),
            color(255, 178, 102),
            color(255, 203, 77),
            color(255, 230, 153),
            color(255, 255, 204)
        ];
        for (let i = 0; i < sunsetColors.length; i++) {
            let y1 = (i * height) / sunsetColors.length;
            let y2 = ((i + 1) * height) / sunsetColors.length;
            let gradient = drawingContext.createLinearGradient(0, y1, 0, y2);
            gradient.addColorStop(0, sunsetColors[i]);
            gradient.addColorStop(1, sunsetColors[i + 1] || sunsetColors[i]);
            drawingContext.fillStyle = gradient;
            noStroke();
            rect(0, y1, width, y2 - y1);
        }
    } else {
        let skyColor = color(135, 206, 250);
        background(skyColor);
    }
}

function drawSun() {
    noStroke();
    fill(255, 215, 0);
    ellipse(sunX, sunY, 80, 80);

    for (let r = 90; r < 130; r += 10) {
        fill(255, 215, 0, 100 - (r - 90));
        ellipse(sunX, sunY, r, r);
    }
}

function drawSandcastle() {
    fill(currentCastleColor);
    rect(width / 2 - 70, height - 170, 30, 30);
    triangle(width / 2 - 70, height - 170, width / 2 - 40, height - 170, width / 2 - 55, height - 200);
    fill(139, 69, 19);
    rect(width / 2 - 57, height - 200, 4, 15);
    fill(255, 0, 0);
    triangle(width / 2 - 55, height - 200, width / 2 - 45, height - 193, width / 2 - 55, height - 187);
}

function drawWaves() {
    noStroke();
    fill(30, 144, 255, 150);
    for (let y = height - 200; y < height - 170; y += 10) {
        beginShape();
        for (let x = 0; x <= width; x += 10) {
            let waveHeight = 2 * sin((x * 0.05) + (waveOffset + y * 0.01));
            vertex(x, y + waveHeight);
        }
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
    }
    waveOffset += 0.03;
}

function drawSand() {
    fill(255, 223, 127);
    noStroke();
    rect(0, height - 150, width, 150);

    for (let dot of sandDots) {
        fill(0, 0, 0, 100);
        ellipse(dot.x, dot.y, 2, 2);
    }
}

function drawSailboat() {
    push();
    translate(sailboatX, height - 190);
    scale(0.5);
    fill(255);
    triangle(-10, 0, 10, 0, 0, -30);
    fill(139, 69, 19);
    rect(-15, 0, 30, 5);
    pop();
}

function mousePressed() {
    if (mouseX > sailboatX - 15 && mouseX < sailboatX + 15 && mouseY > height - 200 && mouseY < height - 150) {
        sailboatMoving = true;
        isMovingLeft = !isMovingLeft;
    }

    if (mouseX > width / 2 - 70 && mouseX < width / 2 - 40 && mouseY > height - 170 && mouseY < height - 140) {
        currentCastleColor = color(random(255), random(255), random(255));
    }

    if (mouseY < horizonY) {
        if (sunVisible) {
            sunX = width - 100;
            sunY = 100;
            isSunset = false;
        } else {
            sunX = width - 100;
            sunY = height - 170;
            isSunset = true;
        }
        sunVisible = !sunVisible;
    }
}

class PalmTree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.fronds = [];
        for (let i = 0; i < 5; i++) {
            this.fronds.push({ angle: i * 72, offset: random(0.1, 0.3) });
        }
    }

    display() {
        stroke(139, 69, 19);
        strokeWeight(16);
        line(this.x, this.y, this.x, this.y - 300);

        fill(34, 139, 34);
        noStroke();
        for (let frond of this.fronds) {
            push();
            translate(this.x, this.y - 300);
            rotate(radians(this.angle + frond.angle));
            ellipse(0, 0, 200, 50);
            pop();
        }
    }

    sway() {
        this.angle = sin(frameCount * 0.05) * 10;
        for (let frond of this.fronds) {
            frond.angle += sin(frameCount * frond.offset) * 0.5;
        }
    }
}
