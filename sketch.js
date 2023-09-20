let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_4.jpg";
let maskFile   = "mask_4.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  // imageMode(CENTER);
  noStroke();
  background(128, 128, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  // image(sourceImg, 0, 0, width, height);
}

function owl(x, y, g, s) {
  push();
  translate(x, y);
  scale(s);  // Set the createCanvas
  stroke(g); // Set the gray value
  strokeWeight(70);
  line(0, -35, 0, -65); // Body
  noStroke();
  fill(255-g);
  ellipse(-17.5, -65, 35, 35); // Left eye dome
  ellipse(17.5, -65, 35, 35);  // Right eye dome
  arc(0, -65, 70, 70, 0, PI);  // Chin
  fill(g);
  ellipse(-14, -65, 8, 8);  // Left eye
  ellipse(14, -65, 8, 8);   // Right eye
  quad(0, -58, 4, -51, 0, -44, -4, -51); // Beak
  pop();
}

function draw () {
  for(let i=0;i<10000;i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);
    let scale = 0.1;
    // if(mask[0] > 128) {
    //   scale = 0.5;
    // }
    // else {
    //   scale = 0.1;
    // }
    fill(pix);
    stroke(pix);
    let pointSize = 20;
    if(mask[0] > 128) {
      strokeWeight(2);
      line(x-1, y, x+1, y);
    }
    else {
      strokeWeight(1);
      line(x, y-50, x, y+50);
    }

    // ellipse(x, y, pointSize, pointSize);
    // owl(x, y, pix[1], scale);
  }
  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
