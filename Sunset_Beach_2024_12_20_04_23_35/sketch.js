let waveOffset = 0;
let trees = [];
let sandDots = [];
let sunX, sunY; // Initial position of the sun
let sunVisible = true; 
let isSunset = true; // Click to toggle between sunset and blue sky
let horizonY = 400; // Y position of the horizon (where the sand starts)

function setup() {
    createCanvas(800, 600);
    sunX = width - 100; 
    sunY = height - 170;  

    trees.push(new PalmTree(100, height - 50)); // Left tree
    trees.push(new PalmTree(width - 100, height - 50)); // Right tree

    // Sand texture
    for (let i = 0; i < 300; i++) {
        sandDots.push({
            x: random(width),
            y: random(height - 150, height)
        });
    }
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
}

function drawBackground() {
    if (isSunset) {
        let sunsetColors = [
            color(255, 87, 34),   // Deep orange
            color(255, 120, 60),  // Reddish orange
            color(255, 178, 102), // Light orange
            color(255, 203, 77),  // Yellow-orange
            color(255, 230, 153), // Pale yellow
            color(255, 255, 204)  // Light cream
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
        // Blue sky
        let skyColor = color(135, 206, 250); // Light blue
        background(skyColor);
    }
}

function drawSun() {
    noStroke();
    fill(255, 215, 0); // Bright golden yellow sun
    ellipse(sunX, sunY, 80, 80);

    for (let r = 90; r < 130; r += 10) {
        fill(255, 215, 0, 100 - (r - 90));
        ellipse(sunX, sunY, r, r);
    }
}

function drawSandcastle() {
    fill(210, 180, 140); // sandcastle color
    rect(width / 2 - 70, height - 170, 30, 30); // Base (moved further left)
    triangle(width / 2 - 70, height - 170, width / 2 - 40, height - 170, width / 2 - 55, height - 200); // Triangle top (moved further left)
    fill(139, 69, 19); // flagpole color
    rect(width / 2 - 57, height - 200, 4, 15); // Flagpole (moved further left)
    fill(255, 0, 0); // flag color
    triangle(width / 2 - 55, height - 200, width / 2 - 45, height - 193, width / 2 - 55, height - 187); // Flag (moved further left)
}

function drawWaves() {
    noStroke();
    fill(30, 144, 255, 150); // blue with transparency
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
    fill(255, 223, 127); // yellow sand
    noStroke();
    rect(0, height - 150, width, 150);

    // Add static texture to sand
    for (let dot of sandDots) {
        fill(0, 0, 0, 100); // Semi-transparent black dots
        ellipse(dot.x, dot.y, 2, 2);
    }
}

function drawSailboat() {
    push();
    translate(width / 2 + 200, height - 190); // Sailboat on the waves
    scale(0.5);
    fill(255); // sail color
    triangle(-10, 0, 10, 0, 0, -30);
    fill(139, 69, 19); // boat color
    rect(-15, 0, 30, 5);
    pop();
}

function mousePressed() {
    // Only change the sky if clicked above the horizon
    if (mouseY < horizonY) {
        // Toggle the sun's position in the sky
        if (sunVisible) {
            sunX = width - 100; // Move the sun up to the top right
            sunY = 100; 
            isSunset = false; // Switch to blue sky
        } else {
            sunX = width - 100; // Reset sun's position to sunset
            sunY = height - 170; // Position it back below the horizon
            isSunset = true; // Set back to sunset 
        }
        sunVisible = !sunVisible; // Toggle sun visibility
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
        stroke(139, 69, 19); // trunk color
        strokeWeight(16);
        line(this.x, this.y, this.x, this.y - 300); // trunk

        fill(34, 139, 34); //Frond color
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

