#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 texOffset;
varying vec4 vertTexCoord;

uniform sampler2D blu;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(void) {

  vec4 p = texture2D(texture, vertTexCoord.st);
  float b = (p.r + p.g + p.b) / 3;  
  vec4 noise = texture2D(blu, vertTexCoord.st);
  float n = (noise.r + noise.g + noise.b) / 3;
  vec3 color = b > n ? vec3(1) : vec3(0);
   
  gl_FragColor = vec4(color, 1);
}
