class Rotation {
  constructor(axis, angle) {
    this.axis = axis;
    this.angle = angle;
    // from https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
    // 3d rotation matrix of this form:
    // a b c
    // d e f
    // g h i
    this.a = cos(angle)+axis.x*axis.x*(1-cos(angle));
    this.b = axis.x*axis.y*(1-cos(angle))-axis.z*sin(angle);
    this.c = axis.x*axis.z*(1-cos(angle))+axis.y*sin(angle);
    this.d = axis.y*axis.x*(1-cos(angle))+axis.z*sin(angle);
    this.e = cos(angle)+axis.y*axis.y*(1-cos(angle));
    this.f = axis.y*axis.z*(1-cos(angle))-axis.x*sin(angle);
    this.g = axis.z*axis.x*(1-cos(angle))-axis.y*sin(angle);
    this.h = axis.z*axis.y*(1-cos(angle))+axis.x*sin(angle);
    this.i = cos(angle)+axis.z*axis.z*(1-cos(angle));
  }
  rotate(vec)
  {
    if(typeof vec.x != 'undefined') {
      let ans = createVector();
      ans.x = this.a*vec.x+this.b*vec.y+this.c*vec.z;
      ans.y = this.d*vec.x+this.e*vec.y+this.f*vec.z;
      ans.z = this.g*vec.x+this.h*vec.y+this.i*vec.z;
      return ans;
    } else {
      let ans = new Rotation(createVector(), 0);
      ans.a = this.a*vec.a + this.b*vec.d + this.c*vec.g;
      ans.b = this.a*vec.b + this.b*vec.e + this.c*vec.h;
      ans.c = this.a*vec.c + this.b*vec.f + this.c*vec.i;
      ans.d = this.d*vec.a + this.e*vec.d + this.f*vec.g;
      ans.e = this.d*vec.b + this.e*vec.e + this.f*vec.h;
      ans.f = this.d*vec.c + this.e*vec.f + this.f*vec.i;
      ans.g = this.g*vec.a + this.h*vec.d + this.i*vec.g;
      ans.h = this.g*vec.b + this.h*vec.e + this.i*vec.h;
      ans.i = this.g*vec.c + this.h*vec.f + this.i*vec.i;
      return ans;
    }
  }
}
