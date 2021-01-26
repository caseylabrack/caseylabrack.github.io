#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 texOffset;
varying vec4 vertTexCoord;
uniform int size;
uniform float mag;

void main(void) {

  vec4 sum = vec4(0.0);
  float dist;
  
  for(int i=-size;i<size;i++) {
    for(int j=-size;j<size;j++) {
        if(i==0 && j==0) continue;
        dist = length(vec2(i,j));
        //dist = 1.0/10.0;
        dist = 1/(pow(dist,mag)+.0001);
        sum += texture2D( texture, vertTexCoord.st + vec2(j,i)*texOffset.st)*dist;
    }
  }
  
  gl_FragColor = sum + vec4(texture2D( texture, vertTexCoord.st).rgb, 1.0);
}
