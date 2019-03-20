class Pendulum{
  constructor(){
    // constants
    let M = 6;
    let m = 1;
    let g = 9.81;
    let b = 0;
    let dt = 0.01;

    // variables
    let r = 200;
    let theta = PI / 2;
    let phi = PI / 2;
    let p_r = 0;
    let p_theta = 0;
    let p_phi = 0.001;

    let iter_frame = 50;
  }

  calculateNewPosition(){
    for(let i = 0; i < this.iter_frame; i++){
      // Calculate coefficients
      let c0 = this.dt * this.p_r / (this.M + this.m);
      let d0 = this.dt * this.p_theta / (this.m * this.r * this.r);
      let e0 = this.dt * (this.p_theta * this.p_theta / (this.m * this.r * this.r * this.r) - this.M * this.g + this.m * this.g * cos(this.theta) + this.p_phi * this.p_phi / (this.m * this.r * this.r * this.r * sin(this.theta) * sin(this.theta)));
      let f0 = this.dt * (- m * g * r * sin(theta) + p_phi * p_phi * cos(theta) / (m * r * r * sin(theta) * sin(theta) * sin(theta)));
      let g0 = dt * (p_phi / (m * r * r * sin(theta) * sin(theta)));
      let h0 = 0;

      let c1 = dt * (p_r + e0 / 2) / (M + m);
      let d1 = dt * (p_theta + f0 / 2) / (m * (r + c0 / 2) * (r + c0 / 2));
      let e1 = dt * ((p_theta + f0 / 2) * (p_theta + f0 / 2) / (m * (r + c0 / 2) * (r + c0 / 2) * (r + c0 / 2)) - M * g + m * g * cos(theta + d0 / 2) + (p_phi + h0 / 2) * (p_phi + h0 / 2) / (m * (r + c0 / 2) * (r + c0 / 2) * (r + c0 / 2) * sin(theta + d0 / 2) * sin(theta + d0 / 2)));
      let f1 = dt * (- m * g * (r + c0 / 2) * sin(theta + d0 / 2) + (p_phi + h0 / 2) * (p_phi + h0 / 2) * cos(theta + d0 / 2) / (m * (r + c0 / 2) * (r + c0 / 2) * sin(theta + d0 / 2) * sin(theta + d0 / 2) * sin(theta + d0 / 2)));
      let g1 = dt * ((p_phi + h0 / 2) / (m * (r + c0 / 2) * (r + c0 / 2) * sin(theta + d0 / 2) * sin(theta + d0 / 2)));
      let h1 = 0;

      let c2 = dt * (p_r + e1 / 2) / (M + m);
      let d2 = dt * (p_theta + f1 / 2) / (m * (r + c1 / 2) * (r + c1 / 2));
      let e2 = dt * ((p_theta + f1 / 2) * (p_theta + f1 / 2) / (m * (r + c1 / 2) * (r + c1 / 2) * (r + c1 / 2)) - M * g + m * g * cos(theta + d1 / 2) + (p_phi + h1 / 2) * (p_phi + h1 / 2) / (m * (r + c1 / 2) * (r + c1 / 2) * (r + c1 / 2) * sin(theta + d1 / 2) * sin(theta + d1 / 2)));
      let f2 = dt * (- m * g * (r + c1 / 2) * sin(theta + d1 / 2) + (p_phi + h1 / 2) * (p_phi + h1 / 2) * cos(theta + d1 / 2) / (m * (r + c1 / 2) * (r + c1 / 2) * sin(theta + d1 / 2) * sin(theta + d1 / 2) * sin(theta + d1 / 2)));
      let g2 = dt * ((p_phi + h1 / 2) / (m * (r + c1 / 2) * (r + c1 / 2) * sin(theta + d1 / 2) * sin(theta + d1 / 2)));;
      let h2 = 0;

      let c3 = dt * (p_r + e2 / 2) / (M + m);
      let d3 = dt * (p_theta + f2 / 2) / (m * (r + c2 / 2) * (r + c2 / 2));
      let e3 = dt * ((p_theta + f2 / 2) * (p_theta + f2 / 2) / (m * (r + c2 / 2) * (r + c2 / 2) * (r + c2 / 2)) - M * g + m * g * cos(theta + d2 / 2) + (p_phi + h2 / 2) * (p_phi + h2 / 2) / (m * (r + c2 / 2) * (r + c2 / 2) * (r + c2 / 2) * sin(theta + d2 / 2) * sin(theta + d2 / 2)));
      let f3 = dt * (- m * g * (r + c2 / 2) * sin(theta + d2 / 2) + (p_phi + h2 / 2) * (p_phi + h2 / 2) * cos(theta + d2 / 2) / (m * (r + c2 / 2) * (r + c2 / 2) * sin(theta + d2 / 2) * sin(theta + d2 / 2) * sin(theta + d2 / 2)));
      let g3 = dt * ((p_phi + h2 / 2) / (m * (r + c2 / 2) * (r + c2 / 2) * sin(theta + d2 / 2) * sin(theta + d2 / 2)));;
      let h3 = 0;

      // Runge-Kutta formulas`
      r += (c0 + 2 * c1 + 2 * c2 + c3) / 6;
      theta += (d0 + 2 * d1 + 2 * d2 + d3) / 6;
      p_r += (e0 + 2 * e1 + 2 * e2 + e3) / 6;
      p_theta += (f0 + 2 * f1 + 2 * f2 + f3) / 6;
      phi += (g0 + 2 * g1 + 2 * g2 + g3) / 6;
      p_phi += (h0 + 2 * h1 + 2 * h2 + h3) / 6;
    }
  }
}
