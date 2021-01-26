int[][] result;
float t, c;

void push() {
  pushMatrix();
  pushStyle();
}

void pop() {
  popStyle();
  popMatrix();
}

void draw() {

  if (!recording) {
    t = mouseX*1.0/width;
    c = mouseY*1.0/height;
    if (mousePressed)
      println(c);
    draw_();
  } else {
    for (int i=0; i<width*height; i++)
      for (int a=0; a<3; a++)
        result[i][a] = 0;

    c = 0;
    for (int sa=0; sa<samplesPerFrame; sa++) {
      t = map(frameCount-1 + sa*shutterAngle/samplesPerFrame, 0, numFrames, 0, 1);
      draw_();
      loadPixels();
      for (int i=0; i<pixels.length; i++) {
        result[i][0] += pixels[i] >> 16 & 0xff;
        result[i][1] += pixels[i] >> 8 & 0xff;
        result[i][2] += pixels[i] & 0xff;
      }
    }

    loadPixels();
    for (int i=0; i<pixels.length; i++)
      pixels[i] = 0xff << 24 | 
        int(result[i][0]*1.0/samplesPerFrame) << 16 | 
        int(result[i][1]*1.0/samplesPerFrame) << 8 | 
        int(result[i][2]*1.0/samplesPerFrame);
    updatePixels();

    saveFrame("output/frame-###.png");
    println(frameCount, "/", numFrames);
    if (frameCount==numFrames)
      exit();
  }
}

//////////////////////////////////////////////////////////////////////

int samplesPerFrame = 20;
int numFrames = 50;        
float shutterAngle = .75;

//boolean recording = false;
boolean recording = true;

PShader blur; 
PShader glow;

Star[] stars = new Star[25];

Hypercube hype;

void setup() {
  size(500, 500, P2D);

  colorMode(HSB, 360, 100, 100, 1);

  blur = loadShader("blur.glsl"); 
  glow = loadShader("glow.glsl");
  glow.set("size", 25);
  glow.set("mag", 2.2);

  result = new int[width*height][3];
  hype = new Hypercube();
  background(0);
  
  for(int i = 0; i < stars.length; i++) {
    stars[i] = new Star();
    stars[i].pos = new PVector(random(10,width-1), random(10,height-10));
    stars[i].offset = random(0,PI);
    stars[i].size = random(.5,1.1);
  }
  
  rectMode(CENTER);
}

void draw_() {

  float t2 = easings.easeInOutQuad(t,0,1,1);
  
  background(0,0,0,1);
  
  //shader(glow);
  hype.update(color(t2*360, 80, 100, 1), t2);
    
  pushStyle();  
  //fill(0,0,100,1);
  stroke(0,0,100,1);
  for(Star s : stars) {
    float w = abs(cos(t * PI + s.offset)) * 2 * s.size;
    strokeWeight(w);
    //pushMatrix();
    //translate(s.pos.x, s.pos.y);
    //rotate(radians(45));
    //rect(0, 0, w, w);
    //popMatrix();
    point(s.pos.x, s.pos.y);
  }
  popStyle();
  
  resetShader();
  filter(glow);
}

class Star {
 PVector pos;
 float offset;
 float size;
}
