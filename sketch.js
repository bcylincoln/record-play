let song;
function preload() {
  // Load a sound file
  song = loadSound('tribesensho.mp3');
}

function setup() {
  createCanvas(500, 400);
}

let arm = {
  x: 383,
  y: 68,
  rot: 0.3,
  minRot: 0.3,
  maxRot: 0.7
};

let recordX = 200;
let recordY = 200;
let recordRotation = 0;

let grooveTop = 230;
let grooveBottom = 312;

let slide = {
  active: false,
  x: 460,
  y: grooveTop + (grooveBottom - grooveTop) / 2,
  w: 40,
  h: 20
};

let power = {
  x: 460,
  y: 340,
  r: 15,
  on: false
};

function getSpeed() {
  let speed = map(mouseY, 0.1, height, 0, 2);
  if (power.on) {
    song.rate(map(slide.y, grooveBottom, grooveTop, .25, 1.75));
    return map(slide.y, grooveBottom, grooveTop, 0, 0.15);
  } else {
    return 0;
  }
}

function draw() {
  background("white");
  
  // draw record
  translate(recordX, recordY);
  rotate(recordRotation);
  noStroke();
  fill("black");
  circle(0, 0, 350);
  
  // draw stripes on the record
  colorMode(HSB, 100);
  let hue = 0;
  strokeWeight(15)
  for (let i = -180; i <= 180; i += 20) {
    stroke(hue, 40, 90);
    hue = (hue + 15) % 100;
    line(i, -180, i, 180);
  }
  noFill();
  stroke("white");
  strokeWeight(100);
  circle(0, 0, 450);
  
  // draw center
  noStroke();
  fill("rgb(224,224,224)");
  circle(0, 0, 120);
  fill("gray");
  circle(0, 0, 15);
  
  rotate(-recordRotation);
  translate(-recordX, -recordY);
  
  
  // draw platform for arm
  stroke("gray");
  fill("gray");
  strokeWeight(20);
  strokeJoin(ROUND);
  triangle(408, 51, 394, 112, 341, 43);
  
  // draw pivot point
  noStroke();
  fill("rgb(87,87,87)");
  circle(arm.x, arm.y, 30);
  
  translate(arm.x, arm.y);
  rotate(arm.rot);
  // draw arm through pivot
  stroke("rgb(87,87,87)");
  strokeWeight(15);
  line(0, -60, 0, 270);
  // draw arm counterweight
  rect(-20, -45, 40, 15);
  rotate(-arm.rot);
  translate(-arm.x, -arm.y);

  
  // draw slider groove
  stroke("rgb(178,178,178)");
  strokeWeight(5);
  line(460, grooveTop, 460, grooveBottom);
  // draw slider
  if (slide.active) {
    fill("green");
  } else {
    fill("black");
  }
  noStroke();
  rect(slide.x - (slide.w / 2), 
       slide.y - (slide.h / 2), 
       slide.w, slide.h);
  
  // draw power button
  noStroke();
  fill("black");
  circle(power.x, power.y, power.r * 2);
  
  // draw light
  noStroke();
  if (power.on) {
    fill("red"); 
  } else {
    fill("gray");
  }
  circle(460, 370, 5);

  // draw outline
  noFill();
  strokeJoin(ROUND);
  strokeWeight(10);
  stroke("black");
  rect(0, 0, 500, 400);
  
  // update values
  recordRotation += getSpeed();
  if (recordRotation > 2*PI) {
    recordRotation = 0
  }
  arm.rot = map(song.currentTime(), 0, song.duration(), arm.minRot, arm.maxRot);
}


function mousePressed() {
  if (mouseX < slide.x + (slide.w / 2) && 
      mouseX > slide.x - (slide.w / 2) && 
      mouseY < slide.y + (slide.h / 2) && 
      mouseY > slide.y - (slide.h / 2)) {
    slide.active = true;
  }
  if (dist(mouseX, mouseY, power.x, power.y) < power.r) {
    power.on = ! power.on;
    if (power.on) {
      userStartAudio();
      song.play();
    } else {
      song.pause();
    }
  }
}

function mouseReleased() {
  slide.active = false;
}

function mouseDragged() {
  if (slide.active && 
      mouseY < grooveBottom &&
      mouseY > grooveTop)
  slide.y = mouseY;
}