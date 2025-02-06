//               (4)----------(5)
//                /|           /|
//               / |          / |
//         (7) ●---+--------● (6)
//            |   |          |  |
//            |   ● (0)------+--● (1)
//            |  /           | /
//            | /            |/
//           (3)------------(2)

//                 ↓
// +------------------------------------------+
// |        Vertex Array (VBO)               |
// |------------------------------------------|
// | idx=0 : (-0.5, -0.5, -0.5)              |
// | idx=1 : ( 0.5, -0.5, -0.5)              |
// | idx=2 : ( 0.5, -0.5,  0.5)              |
// | idx=3 : (-0.5, -0.5,  0.5)              |
// | idx=4 : (-0.5,  0.5, -0.5)              |
// | idx=5 : ( 0.5,  0.5, -0.5)              |
// | idx=6 : ( 0.5,  0.5,  0.5)              |
// | idx=7 : (-0.5,  0.5,  0.5)              |
// +------------------------------------------+
//                 ↓
// +------------------------------------------+
// |        Index Array (IBO/EBO)            |
// |------------------------------------------|
// |   // 每个面由两个三角形组成 (示例)      |
// | Face1 (bottom): (0,1,2), (2,3,0)         |
// | Face2 (top)   : (4,5,6), (6,7,4)         |
// | Face3 (front) : (0,1,5), (5,4,0)         |
// | Face4 (back)  : (3,2,6), (6,7,3)         |
// | Face5 (right) : (1,2,6), (6,5,1)         |
// | Face6 (left)  : (0,3,7), (7,4,0)         |
// +------------------------------------------+


/**
* Worley Noise的Shader生成
* @see https://zhuanlan.zhihu.com/p/94632440
* @see https://www.shadertoy.com/view/433BDr
*/

vec2 hash22( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 st = fragCoord.xy/iResolution.y;
  vec3 color = vec3(.0);
  vec2 uv=st*30.0;
  vec2 id=floor(uv);
  vec2 offset=fract(uv);
  float min_dist=1.0;
  for(int m=-1;m<=1;m++){
      for(int n=-1;n<=1;n++){
          vec2 point=id+vec2(m,n);
          vec2 offset2=hash22(point);
          offset2=0.5*sin(iTime + 6.2831*offset2);
          vec2 uv2=point+offset2;
          float dist=distance(uv,uv2);
          min_dist=min(min_dist,dist);
      }
  }
  color+=min_dist;
  fragColor = vec4(color,1.0);
}