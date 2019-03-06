// constants
let M = 3;
let m = 1;
let g = 9.81;
let b = 0;
let dt = 0.00001;

// variables
let r = 200;
let theta = 0;
let phi = 0;
let p_r = 0;
let p_theta = 0;
let p_phi = 1;

let c = [];
let d = [];
let e = [];
let f = [];

let iter_frame = 5000;

let x, y, z;

// sliders
let g_slider;
let m_slider;
let M_slider;
let b_slider;

let prev = [];

let cam_pos, cam_up, cam_right;

let g_text, m_text, M_text, b_text;
let text_size = 12;

let alpha=0, beta=0;

let lastMouseX, lastMouseY, lastMouseP = 0;
let sliderX, sliderY;

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
    let ans = createVector();
    ans.x = this.a*vec.x+this.b*vec.y+this.c*vec.z;
    ans.y = this.d*vec.x+this.e*vec.y+this.f*vec.z;
    ans.z = this.g*vec.x+this.h*vec.y+this.i*vec.z;
    return ans;
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  pixelDensity(1);
  theta = PI / 2;

  pg = createGraphics(800, 600);

  cam_pos = createVector(0, 0, 1);
  cam_up = createVector(0, 1, 0);
  cam_right = createVector(1, 0, 0);

  setupSliders();
}

function positionCamera(){
  let clen = height/2.0/tan(PI*30.0/180.0);
  camera(clen*cam_pos.x, clen*cam_pos.y, clen*cam_pos.z, 0, 0, 0, cam_up.x, cam_up.y, cam_up.z);

  if(mouseIsPressed && !(mouseX < sliderX && mouseY < sliderY)) {
    if(lastMouseP) {
      let dx = mouseX-lastMouseX;
      let dy = mouseY-lastMouseY;
      let alpha = dx/100;
      let beta = dy/100;
      let rotx = new Rotation(cam_up, -alpha);
      let roty = new Rotation(cam_right, beta);
      cam_up = rotx.rotate(cam_up);
      cam_up = roty.rotate(cam_up);
      cam_right = rotx.rotate(cam_right);
      cam_right = roty.rotate(cam_right);
      cam_pos = rotx.rotate(cam_pos);
      cam_pos = roty.rotate(cam_pos);
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastMouseP = mouseIsPressed;
  } else {
    lastMouseP = 0;
  }
}

function setupSliders(){
  g_slider = createSlider(0, 20, g, 0.1);
  g_slider.position(15, 15);
  m_slider = createSlider(0, 10, m);
  m_slider.position(g_slider.x, g_slider.y + g_slider.height + 10);
  M_slider = createSlider(0, 20, M);
  M_slider.position(m_slider.x, m_slider.y + m_slider.height + 10);
  b_slider = createSlider(0, 10, b);
  b_slider.position(M_slider.x, M_slider.y + M_slider.height + 10);
  g_text = createSpan("");
  M_text = createSpan("");
  m_text = createSpan("");
  b_text = createSpan("");
  g_text.position(g_slider.x+g_slider.width+15, (g_slider.y + (g_slider.height / 2) + (text_size / 2)));
  m_text.position((m_slider.x + m_slider.width + 15), (m_slider.y + (m_slider.height / 2) + (text_size / 2)));
  M_text.position((M_slider.x + M_slider.width + 15), (M_slider.y + (M_slider.height / 2) + (text_size / 2)));
  b_text.position((b_slider.x + b_slider.width + 15), (b_slider.y + (b_slider.height / 2) + (text_size / 2)));
  sliderX = M_slider.x+m_slider.width+100;
  sliderY = b_slider.y + b_slider.height+10;
}

let counter = 0;
function draw() {
  if(counter < 125){
  background(175);

  drawSliders();
	stroke(0);
	strokeWeight(2);

	x = r * sin(theta) * cos(phi);
	y = r * cos(theta) * cos(phi);
  z = r * sin(phi);

  console.log(counter + " " + x + " " + z + " " + (-y));

  positionCamera();

  calculateNewPosition();
  drawTransition();
  counter++;}
}

function drawSliders(){
  M = M_slider.value();
  m = m_slider.value();
  g = g_slider.value();
  b = b_slider.value();
  m_text.html("m: " + m);
  M_text.html("M: " + M);
  g_text.html("gravity: " + g);
  b_text.html("damping: " + b);
}

function calculateNewPosition(){
  let aux = phi;
  for(let i = 0; i < iter_frame; i++){
    // Calculate coefficients
    let c0 = dt * p_r / (M + m);
    let d0 = dt * p_theta / (m * r * r);
    let e0 = dt * (p_theta * p_theta / (m * r * r * r) - M * g + m * g * cos(theta) + p_phi * p_phi / (m * r * r * r * sin(theta) * sin(theta)));
    let f0 = dt * (- m * g * r * sin(theta) + p_phi * p_phi * cos(theta) / (m * r * r * sin(theta) * sin(theta) * sin(theta)));
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
    // theta %= 2 * PI;
    p_r += (e0 + 2 * e1 + 2 * e2 + e3) / 6;
    p_theta += (f0 + 2 * f1 + 2 * f2 + f3) / 6;
    phi += (g0 + 2 * g1 + 2 * g2 + g3) / 6;
    // phi %= 2 * PI;
    p_phi += (h0 + 2 * h1 + 2 * h2 + h3) / 6;
  }
}

function drawTransition(){
  beginShape(POINTS);
  for(let q of prev) {
    vertex(q[0], q[1], q[2]);
  }
  endShape();
  if (frameCount > 1) {
    prev.push([x,y,z]);
    if(prev.length > 10000) prev.shift();
  }
}
