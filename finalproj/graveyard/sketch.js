let stars = []; // Array to store star positions
let shake = false; // Flag to enable shaking
let shakeTimer = 0; // Timer for shaking
let rain = false; // Flag for rain
let raindrops = []; // Array to store raindrop positions
let eye = null; // Eye object for the pop-out effect
let eyeTimer = 0; // Timer for fading the eye

function setup() {
  createCanvas(800, 600);
  noStroke();

  // Generate star positions once
  for (let i = 0; i < 100; i++) {
    let starX = random(width);
    let starY = random(height * 0.6); // Keep stars in the upper part of the sky
    stars.push({ x: starX, y: starY });
  }
}

function draw() {
  // Check if shaking is active
  if (shake) {
    translate(random(-10, 10), random(-10, 10)); // Apply shake effect
    shakeTimer--;
    if (shakeTimer <= 0) {
      shake = false; // Stop shaking after the timer ends
    }
  }

  // Redraw the background layer
  drawBackground();

  // Draw rain if active
  if (rain) {
    drawRain();
  }

  // Draw foreground layer
  drawForeground();

  // Draw the eye if it exists (when clicked)
  if (eye) {
    fill(255, 255, 255, eye.alpha); // Set the transparency based on the alpha value
    ellipse(eye.x, eye.y, 40, 40); // Draw the outer eye

    // Draw the red iris inside the eye
    fill(255, 0, 0); // Red color for the iris
    ellipse(eye.x, eye.y, 25, 25); // Draw the iris

    // Draw the black pupil inside the iris
    fill(0); // Black color for the pupil
    ellipse(eye.x, eye.y, 10, 10); // Draw the pupil

    eye.alpha -= 5; // Decrease alpha to fade out
    if (eye.alpha <= 0) {
      eye = null; // Remove the eye when fully faded
    }
  }
}

function drawBackground() {
  // Draw sky
  background(4, 3, 26); // Darker blue sky

  // Draw scattered stars (static positions)
  fill(221, 230, 147); // Star color
  for (let star of stars) {
    ellipse(star.x, star.y, 3, 3); // Small star
  }

  // Draw moon
  fill(255); // Bright white
  ellipse(120, 100, 50, 50); // Smaller moon

  // Draw clouds
  fill(15, 15, 14); // Cloud color
  ellipse(220, 80, 150, 200); // Cloud 1
  ellipse(500, 100, 350, 200); // Cloud 2
  ellipse(750, 100, 300, 200); // Cloud 3
  ellipse(10, 100, 200, 200); // Cloud 4
  ellipse(350, 90, 250, 200); // Cloud 5

  // Draw hills in the background
  fill(50); // Dark gray

  // First hill
  beginShape();
  for (let x = 0; x <= width / 2; x += 10) {
    let y = height * 0.7 - 100 * sin((PI * x) / (width / 2));
    vertex(x, y);
  }
  vertex(width / 2, height);
  vertex(0, height);
  endShape(CLOSE);

  // Second hill
  beginShape();
  for (let x = width / 2; x <= width; x += 10) {
    let y = height * 0.7 - 100 * sin((PI * (x - width / 2)) / (width / 2));
    vertex(x, y);
  }
  vertex(width, height);
  vertex(width / 2, height);
  endShape(CLOSE);
}

function drawForeground() {
  // Draw foreground ground
  fill(69, 74, 70); // Lighter gray
  rect(0, height * 0.7, width, height * 0.3);

  // Draw fence at the top of the foreground
  fill(0); // Black color for the fence
  for (let x = 0; x < width; x += 30) {
    rect(x, height * 0.65, 10, 40); // Fence posts
  }
  rect(0, height * 0.65 + 20, width, 10); // Horizontal bar

  // Draw gravestones
  fill(113, 117, 114); // Gravestone color
  rect(150, height * 0.7, 100, 150); // Gravestone 1 rectangle
  ellipse(200, height * 0.7, 100, 100); // Gravestone 1 top

  rect(350, height * 0.7, 100, 150); // Gravestone 2 rectangle
  ellipse(400, height * 0.7, 100, 100); // Gravestone 2 top

  // Draw tree
  fill(15, 8, 1); // Tree trunk color
  rect(700, height * -0.03, 120, 800); // Tree trunk
  fill(15, 8, 1); // Tree branch color
  ellipse(550, height * -0.05, 700, 150); // Branch
  fill(0, 0, 0);
  ellipse(800, 300, 150, 200); // Hole in the tree
}

function drawRain() {
  fill(0, 0, 0); // Light blue for raindrops
  for (let i = raindrops.length - 1; i >= 0; i--) {
    rect(raindrops[i].x, raindrops[i].y, 2, 10); // Draw thin raindrop
    raindrops[i].y += 5; // Move raindrop down

    // Remove raindrop if it goes out of canvas
    if (raindrops[i].y > height) {
      raindrops.splice(i, 1);
    }
  }

  // Add new raindrops
  if (frameCount % 10 === 0) { // Add rain less frequently
    for (let i = 0; i < 3; i++) {
      // Randomly pick a cloud to spawn the raindrop
      let cloudX = random([220, 500, 750, 10, 350]);
      let cloudWidth = cloudX === 500 ? 350 : 150; // Adjust width for Cloud 2
      raindrops.push({
        x: random(cloudX - cloudWidth / 2, cloudX + cloudWidth / 2),
        y: random(100, 120) // Slightly below the cloud
      });
    }
  }
}

function mousePressed() {
  // Check if the mouse is over either gravestone
  if (
    (mouseX > 150 && mouseX < 250 && mouseY > height * 0.7 && mouseY < height) || // Gravestone 1
    (mouseX > 350 && mouseX < 450 && mouseY > height * 0.7 && mouseY < height)   // Gravestone 2
  ) {
    shake = true; // Enable shaking
    shakeTimer = 30; // Set shake duration (frames)
  }

  // Check if the mouse is over the clouds
  if (
    (mouseX > 100 && mouseX < 300 && mouseY > 0 && mouseY < 200) || // Cloud 1
    (mouseX > 400 && mouseX < 650 && mouseY > 50 && mouseY < 200) || // Cloud 2
    (mouseX > 700 && mouseX < 850 && mouseY > 0 && mouseY < 200) || // Cloud 3
    (mouseX > 0 && mouseX < 200 && mouseY > 0 && mouseY < 200) || // Cloud 4
    (mouseX > 300 && mouseX < 500 && mouseY > 50 && mouseY < 200) // Cloud 5
  ) {
    rain = !rain; // Toggle rain
  }

  // Check if the mouse is over the black hole in the tree
  if (
    mouseX > 750 && mouseX < 850 && mouseY > 250 && mouseY < 350 // Hole area
  ) {
    // Create and display the eye
    eye = { x: 780, y: 300, alpha: 255 }; // Eye position and alpha value for fading
    eyeTimer = 50; // Set the timer for how long the eye stays
  }
}
