PImage img;
PGraphics fbo;
PShader dith;
PImage blu;
float ratio;
int fnum = 200;

void setup () {
  size(512,512, P2D);
  pixelDensity(displayDensity());
  blu = loadImage("LDR_LLL1_0.png");
  img = loadImage("dir.jpg");
  dith = loadShader("dithblu.glsl");
  dith.set("blu", blu);
  ratio = (float)img.width/(float)img.height;
  imageMode(CENTER);
  
  fbo = createGraphics(512, 512);
  fbo.imageMode(CENTER);
}

void draw () {

  float progress = (float)frameCount/(float)fnum;
  
  float t = 1 - (1 + cos(radians(progress*360)) )/ 2;
  println(frameCount+ "/" +fnum + "    " + t);
  
  float t2 = easings.easeInOutQuart(t,0,1,1);
  
  fbo.beginDraw();
  fbo.translate(width/2, height/2);
  fbo.scale(1 + t2 * (4.5-1));
  fbo.image(img,0,0,512,512);
  fbo.endDraw();

  
  translate(width/2, height/2);
  shader(dith);
  
  image(fbo, 0, 0, 512, 512);
  saveFrame("output/frame-###.png");
  if(frameCount==fnum) exit();
}
