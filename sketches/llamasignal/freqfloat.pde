PShape mask;
PImage llama;

void setup() {
  size(600, 600, P2D);
  //pixelDensity(displayDensity());
  noFill();
  frameRate(30);

  // create circular "mask" to draw over animation
  pushStyle();
  fill(256, 256, 256);
  noStroke();
  mask = createShape();
  mask.beginShape();
  //mask.fill(45,45,45);
  mask.vertex(0, 0);
  mask.vertex(width, 0);
  mask.vertex(width, height);
  mask.vertex(0, height);
  mask.beginContour();
  for (int i = 360; i > 0; i--) {
    mask.vertex(
      width/2 + cos(radians(i)) * width/2, 
      height/2 + sin(radians(i)) * height/2
      );
  }
  mask.endContour();
  mask.endShape(CLOSE);
  popStyle();

  llama = loadImage("llama2.png");
  llama.loadPixels();
}

int index (int x, int y, int w) {
  return y * w + x;
}

int getBWPixelValue (int x, int y, int w) {
  return llama.pixels[index(x, y, w)] >> 16 & 0xFF;
} 

void draw() {
  background(256, 256, 256);

  float step = 6;
  //step = map(mouseX, 0, width, 1,12);
  //println(step);
  int yoff = int(frameCount % step);
  float lightness = map(mouseX, 0, width, 0, 256);
  float angle;
  float y;
  float freq;
  float maxFreq = abs(sin(radians(frameCount % 360)) * 2);
  for (int k = 0; k < height; k += step) {
    beginShape();
    for (int i = 0; i < width; i+=step) {
      lightness = (float)getBWPixelValue(i, k + yoff, width);
      freq = map(lightness, 0, 255, maxFreq, 0);
      for (float j = 0; j < step; j++) {
        angle = j/step * TWO_PI;
        y = sin(angle * freq) * step/2;
        vertex(i + j, k + y + yoff);
      }
    }
    endShape();
  }
  shape(mask);

  //pushStyle();
  //strokeWeight(.5);
  //beginShape();
  //for (int i = 360; i > 0; i--) {
  //  vertex(
  //    width/2 + cos(radians(i)) * width/2, 
  //    height/2 + sin(radians(i)) * height/2
  //    );
  //}
  //endShape();
  //popStyle();
  //println(lightness + "  " + maxFreq);

  saveFrame("output/frame-###.png");
  if (frameCount >= 180) exit();
}
