class Pendulum{
  constructor(){
    // constants
    this.M = 10;
    this.m = 1;
    this.g = 9.81;
    this.b = 0;
    this.dt = 0.001;

    // variables
    this.r = 200;
    this.theta = PI / 2;
    this.phi = PI / 2;
    this.p_r = 0;
    this.p_theta = 0;
    this.p_phi = 0.00;

    this.iter_frame = 500;

    this.prev = new Queue();
  }

  calculateNewPosition(){
    for(let i = 0; i < this.iter_frame; i++){
        let c_arr = [];
        let d_arr = [];
        let e_arr = [];
        let f_arr = [];
        let g_arr = [];
        let h_arr = [];
        let prev_c = 0; // r
        let prev_d = 0; // theta
        let prev_e = 0; // p_r
        let prev_f = 0; // p_theta
        let prev_g = 0; // phi
        let prev_h = 0; // p_phi

        for(let j = 0; j < 4; j++){
          let r_aux = this.r + prev_c / 2;
          let theta_aux = this.theta + prev_d / 2;
          let p_r_aux = this.p_r + prev_e / 2;
          let p_theta_aux = this.p_theta + prev_f / 2;
          let phi_aux = this.phi + prev_g / 2;
          let p_phi_aux = this.p_phi + prev_h / 2;

          let c_j = this.dt * (p_r_aux) / (this.M+this.m);
          prev_c = c_j;
          c_arr.push(c_j);

          let d_j = this.dt * (p_theta_aux) / (this.m * r_aux * r_aux);
          prev_d = d_j;
          d_arr.push(d_j);

          let e_j = this.dt * (p_theta_aux * p_theta_aux / (this.m * r_aux * r_aux * r_aux)
                                - this.M * this.g + this.m * this.g * cos(theta_aux)
                                + p_phi_aux * p_phi_aux / (this.m * r_aux * r_aux * r_aux * sin(theta_aux) * sin(theta_aux))
                                - this.b * p_r_aux / (this.m + this.M)); // drag term
          prev_e = e_j;
          e_arr.push(e_j);

          let f_j = this.dt * (- this.m * this.g * r_aux * sin(theta_aux)
                                + p_phi_aux * p_phi_aux * cos(theta_aux) / (this.m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux) * sin(theta_aux))
                                - this.b * r_aux * p_theta_aux / (this.m * r_aux * r_aux)); // drag term
          prev_f = f_j;
          f_arr.push(f_j);

          let g_j = this.dt * (p_phi_aux / (this.m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux)));
          prev_g = g_j;
          g_arr.push(g_j);

          let h_j = this.dt * (0
                              - this.b * r_aux * sin(theta_aux) * p_phi_aux / (this.m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux))); // drag term
          prev_h = h_j;
          h_arr.push(h_j);
        }

        // Runge-Kutta formulas
        this.r += (c_arr[0] + 2 * c_arr[1] + 2 * c_arr[2] + c_arr[3]) / 6;
        this.theta += (d_arr[0] + 2 * d_arr[1] + 2 * d_arr[2] + d_arr[3]) / 6;
        this.p_r += (e_arr[0] + 2 * e_arr[1] + 2 * e_arr[2] + e_arr[3]) / 6;
        this.p_theta += (f_arr[0] + 2 * f_arr[1] + 2 * f_arr[2] + f_arr[3]) / 6;
        this.phi += (g_arr[0] + 2 * g_arr[1] + 2 * g_arr[2] + g_arr[3]) / 6;
        this.p_phi += (h_arr[0] + 2 * h_arr[1] + 2 * h_arr[2] + h_arr[3]) / 6;
    }
  }

  x() {
    return this.r * sin(this.theta) * cos(this.phi);
  }
  y() {
    return this.r * sin(this.theta) * sin(this.phi);
  }
  z() {
    return -this.r * cos(this.theta);
  }
  pos() {
    let ret = createVector();
    ret.x = this.x();
    ret.y = this.y();
    ret.z = this.z();
    return ret;
  }
  drhat() {
    let rh = createVector();
    rh.x = sin(this.theta) * cos(this.phi);
    rh.y = sin(this.theta) * sin(this.phi);
    rh.z = - cos(this.theta);
    return rh;
  }
  dthetahat() {
    let th = createVector();
    th.x = sin(this.theta+PI/2) * cos(this.phi);
    th.y = sin(this.theta+PI/2) * sin(this.phi);
    th.z = - cos(this.theta+PI/2);
    return th;
  }
  dphihat() {
    let ph = createVector();
    ph.x = sin(this.theta) * cos(this.phi+PI/2);
    ph.y = sin(this.theat) * sin(this.phi+PI/2);
    ph.z = 0;
    return ph;
  }

  addXYZ(){
    let res = [];
    let x = this.r * sin(this.theta) * cos(this.phi);
    let y = this.r * sin(this.theta) * sin(this.phi);
    let z = -this.r * cos(this.theta);
    res.push(x);
    res.push(y);
    res.push(z);

    console.log(this.r);

    this.prev.push(res);
  }
}
