precision highp float;

attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Scale;
varying vec4 v_Color;
uniform mat4 mat;

void main(){
  gl_Position=mat*a_Position*a_Scale;
  v_Color=a_Color;
}