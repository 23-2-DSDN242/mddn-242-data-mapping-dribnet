let sourceImg=null;
let maskImg=null;
let texImg=null;

// change these three lines as appropiate
let sourceFile = "input_n.jpg";
let maskFile   = "mask_n.png";
let outputFile = "output_n.png";
let textureFile = "texture_car.png"
let maskCenter = null;
let maskCenterSize = null;

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  texImg = loadImage(textureFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  texImg.loadPixels();
  colorMode(HSB);

  maskCenterSearch2(20);
}

// let X_STOP = 640;
// let Y_STOP = 480;
let X_STOP = 1920;
let Y_STOP = 1080;
let OFFSET = 20;

function maskCenterSearch(min_width) {
    let max_up_down = 0;
    let max_left_right = 0;
    let max_x_index = 0;
    let max_y_index = 0;

    // first scan all rows top to bottom
    print("Scanning mask top to bottom...")
    for(let j=0; j<Y_STOP; j++) {
      // look across this row left to right and count
      let mask_count = 0;
      for(let i=0; i<X_STOP; i++) {
        let mask = maskImg.get(i, j);
        if (mask[1] > 128) {
          mask_count = mask_count + 1;
        }
      }
      // check if that row sets a new record
      if (mask_count > max_left_right) {
        max_left_right = mask_count;
        max_y_index = j;
      }
    }

    // now scan once left to right as well
    print("Scanning mask left to right...")
    for(let i=0; i<X_STOP; i++) {
      // look across this column up to down and count
      let mask_count = 0;
      for(let j=0; j<Y_STOP; j++) {
        let mask = maskImg.get(i, j);
        if (mask[1] > 128) {
          mask_count = mask_count + 1;
        }
      }
      // check if that row sets a new record
      if (mask_count > max_up_down) {
        max_up_down = mask_count;
        max_x_index = i;
      }
    }

    print("Scanning mask done!")
    if (max_left_right > min_width && max_up_down > min_width) {
      maskCenter = [max_x_index, max_y_index];
      maskCenterSize = [max_left_right, max_up_down];
    }
}

function maskCenterSearch2(min_width) {
  // we store the sum of x,y whereever the mask is on
  // at the end we divide to get the average
  let mask_x_sum = 0;
  let mask_y_sum = 0;
  let mask_count = 0;

  // first scan all rows top to bottom
  print("Scanning mask top to bottom...")
  for(let j=0; j<Y_STOP; j++) {
    // look across this row left to right and count
    for(let i=0; i<X_STOP; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_x_sum = mask_x_sum + i;
        mask_y_sum = mask_y_sum + j;
        mask_count = mask_count + 1;
      }
    }
  }

  print("Scanning mask done!")
  if (mask_count > min_width) {
    let avg_x_pos = int(mask_x_sum / mask_count);
    let avg_y_pos = int(mask_y_sum / mask_count);
    maskCenter = [avg_x_pos, avg_y_pos];
    print("Center set to: " + maskCenter);
  }
}

let renderCounter=0;
function draw () {
  angleMode(DEGREES);
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
    for(let i=0; i<X_STOP; i++) {
      colorMode(RGB);
      let mask = maskImg.get(i, j);
      let tex = texImg.get(int(i-maskCenter[0]/2), int(j-maskCenter[1]/2));
      let pix = sourceImg.get(i, j);
      if (mask[1] > 128) {
        if(tex[1] != 0) {
          pix[1] = tex[1];
        }
      }

      set(i, j, pix);
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

  if (maskCenter !== null) {
    // image(texImg, maskCenter[0], maskCenter[1]);
    strokeWeight(5);
    fill(0, 255, 0);
    stroke(255, 0, 0);
    ellipse(maskCenter[0], maskCenter[1], 100);
    line(maskCenter[0]-200, maskCenter[1], maskCenter[0]+200, maskCenter[1]);
    line(maskCenter[0], maskCenter[1]-200, maskCenter[0], maskCenter[1]+200);
    noFill();
    // let mcw = maskCenterSize[0];
    // let mch = maskCenterSize[1];
    // rect(maskCenter[0]-mcw/2, maskCenter[1]-mch/2, mcw, mch);
  }

  // print(renderCounter);
  if(renderCounter > Y_STOP) {
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