class Pendulum{
  constructor(){
    console.log("here");
    // constants
    this.M = 5;
    this.m = 1;
    this.g = 9.81;
    this.b = 0;
    this.dt = 0.01;

    // variables
    this.r = 200;
    this.theta = PI / 2;
    this.phi = PI / 2;
    this.p_r = 0;
    this.p_theta = 0;
    this.p_phi = 0.001;

    this.iter_frame = 50;

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

          let e_j = this.dt * (p_theta_aux * p_theta_aux / (this.m * r_aux * r_aux * r_aux) - this.M * this.g + this.m * this.g * cos(theta_aux) + p_phi_aux * p_phi_aux / (this.m * r_aux * r_aux * r_aux * sin(theta_aux) * sin(theta_aux)));
          prev_e = e_j;
          e_arr.push(e_j);

          let f_j = this.dt * (- this.m * this.g * r_aux * sin(theta_aux) + p_phi_aux * p_phi_aux * cos(theta_aux) / (this.m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux) * sin(theta_aux)));
          prev_f = f_j;
          f_arr.push(f_j);

          let g_j = this.dt * (p_phi_aux / (this.m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux)));
          prev_g = g_j;
          g_arr.push(g_j);

          let h_j = 0;
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

  addXYZ(){
    let res = [];
    let x = this.r * sin(this.theta) * cos(this.phi);
    let y = this.r * sin(this.theta) * sin(this.phi);
    let z = -this.r * cos(this.theta);
    res.push(x);
    res.push(y);
    res.push(z);

    this.prev.push(res);
  }
}
