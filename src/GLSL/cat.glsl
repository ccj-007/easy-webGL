/*
This code is "code to draw 3D Doraemon with ray marching" generated by GPT-4.
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float scene(vec3 p);
vec3 raymarch(vec3 ro,vec3 rd);

// 簡易ドラえもんの距離関数
float doraemon(vec3 p,out vec3 color);

// 回転関数
mat3 rotationY(float angle);
vec3 rotateY(vec3 p,float angle);

void main(void){
  vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
  
  vec3 ro=vec3(0.,0.,-3.5);
  vec3 rd=normalize(vec3(uv,1.));
  
  vec3 color=raymarch(ro,rd);
  
  gl_FragColor=vec4(color,1.);
}

// レイマーチング関数
vec3 raymarch(vec3 ro,vec3 rd){
  float t=0.;
  vec3 p;
  vec3 color=vec3(0.);
  for(int i=0;i<64;i++){
    p=ro+t*rd;
    float d=doraemon(p,color);
    if(d<.001){
      break;
    }
    t+=d;
  }
  
  vec3 normal=normalize(vec3(
      doraemon(p+vec3(.001,0.,0.),color)-doraemon(p-vec3(.001,0.,0.),color),
      doraemon(p+vec3(0.,.001,0.),color)-doraemon(p-vec3(0.,.001,0.),color),
      doraemon(p+vec3(0.,0.,.001),color)-doraemon(p-vec3(0.,0.,.001),color)
    ));
    
    vec3 lightDirection=normalize(rotateY(vec3(.5,.5,1.),u_time));
    float diffuse=max(0.,dot(normal,lightDirection));
    vec3 ambient=vec3(.2);
    color=color*(ambient+diffuse);
    
    return color;
  }
  
  // 簡易ドラえもんの距離関数
  float doraemon(vec3 p,out vec3 color){
    p=rotateY(p,u_time);
    float head=length(p-vec3(0.,.2,0.))-.6;
    float body=length(p-vec3(0.,-.5,0.))-.4;
    float leftEye=length(p-vec3(-.2,.3,.5))-.08;
    float rightEye=length(p-vec3(.2,.3,.5))-.08;
    float nose=length(p-vec3(0.,.2,.6))-.1;
    float mouth=length(p-vec3(0.,.1,.55))-.05;
    float bell=length(p-vec3(0.,-.2,.6))-.05;
    float d=min(head,body);
    d=min(d,leftEye);
    d=min(d,rightEye);
    d=min(d,nose);
    d=min(d,mouth);
    d=min(d,bell);
    
    if(d==head){
      color=vec3(0.,0.,1.);
    }else if(d==body){
      color=vec3(0.,0.,1.);
    }else if(d==leftEye||d==rightEye){
      color=vec3(1.);
    }else if(d==nose){
      color=vec3(.8,0.,0.);
    }else if(d==mouth){
      color=vec3(0.);
    }else if(d==bell){
      color=vec3(.8,.8,0.);
    }
    
    return d;
  }
  
  // 回転関数
  mat3 rotationY(float angle){
    float c=cos(angle);
    float s=sin(angle);
    return mat3(c,0.,-s,0.,1.,0.,s,0.,c);
  }
  
  vec3 rotateY(vec3 p,float angle){
    return rotationY(angle)*p;
  }