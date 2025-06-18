uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
uniform vec4 vUv;
uniform vec4 vPosition;
float PI = 3.141592653589793238;

void main(){
    gl_FragColor = vec4(vUv, 0.0, 1.0);
}
