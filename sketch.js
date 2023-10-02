let sourceImg=null;
let maskImg=null;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);
}

let X_STOP = 640;
let Y_STOP = 480;
let OFFSET = 6;

let renderCounter=5;
function draw () {
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=5; i<X_STOP; i++) {
      colorMode(RGB);
      let pix = [0, 0, 0, 255];
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        pix = sourceImg.get(i, j);
      }
      else {
        let sum_rgb = [0, 0, 0]
        let num_cells = 0;
        for(let wx=-OFFSET;wx<OFFSET;wx++){
          for (let wy=-OFFSET;wy<OFFSET;wy++) {
            let pix = sourceImg.get(i+wx, j+wy);
            for(let c=0; c<3; c++) {
              sum_rgb[c] += pix[c];
            }
            num_cells += 1;
          }
        }
        for(let c=0; c<3; c++) {
          pix[c] = int(sum_rgb[c] / num_cells);
        }        
      }

      set(i, j, pix);
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

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
