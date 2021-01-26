static class easings {

  static float easeLinear (float t, float b, float c, float d) { 
    return b + c * (t/d);
  }

  static float easeInOutQuad (float t, float b, float c, float d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  }

  static float easeInOutQuart (float t, float b, float c, float d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  }

  static float easeInOutExpo (float t, float b, float c, float d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return (float)(c/2 * Math.pow(2, 10 * (t - 1)) + b);
    return (float)(c/2 * (-Math.pow(2, -10 * --t) + 2) + b);
  }

  static float easeInExpo (float t, float b, float c, float d) {
    return (float)((t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b);
  }

  static float easeOutExpo (float t, float b, float c, float d) {
    return (t==d) ? b+c : (float)(c * (-Math.pow(2, -10 * t/d) + 1) + b);
  }

  static float easeOutQuad (float t, float b, float c, float d) {
    return -c *(t/=d)*(t-2) + b;
  }

  static float easeInQuad (float t, float b, float c, float d) {
    return c*(t/=d)*t + b;
  }
}
