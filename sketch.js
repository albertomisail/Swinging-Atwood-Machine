let M = 8;
let m = 3;
let g = 9.81;
let b = 0;

let r = 200;
let v_r = 0;
let theta = 0;
let v_theta = 0;

let dt = 0.00001;

let iter_frame = 50000;

let px = -1;
let py = -1;
let cx, cy;

let buffer;

let counter = 0;

// sliders
let g_slider;
let m_slider;
let M_slider;

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
  createCanvas(windowWidth, windowHeight, WEBGL);
  //Issue with wrong rendering on a retina Mac. See issue: https://github.com/CodingTrain/website/issues/574
  pixelDensity(1);
  theta = PI / 2;
  cx = 0 ;//= windowWidth / 2;
  cy = 0 ;//= windowHeight / 3;
  buffer = createGraphics(windowWidth, windowHeight, WEBGL);
  buffer.background(175);
  buffer.translate(cx, cy);

  pg = createGraphics(windowWidth, windowHeight);

  cam_pos = createVector(0, 0, 1);
  cam_up = createVector(0, 1, 0);
  cam_right = createVector(1, 0, 0);

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

function draw() {
  let clen = height/2.0/tan(PI*30.0/180.0);
  camera(clen*cam_pos.x, clen*cam_pos.y, clen*cam_pos.z, 0, 0, 0, cam_up.x, cam_up.y, cam_up.z);

  background(175);
  //imageMode(CORNER);
  //image(buffer, 0, 0, windowWidth, windowHeight);
  //model(buffer);
  M = M_slider.value();
  m = m_slider.value();
  g = g_slider.value();
  b = b_slider.value();
  strokeWeight(0);
  fill(0);
  //pg.textSize(text_size);
  m_text.html("m: " + m);
  M_text.html("M: " + M);
  g_text.html("gravity: " + g);
  b_text.html("damping: " + b);

  translate(cx, cy);
  stroke(0);
  strokeWeight(2);

  let x = r * sin(theta);
  let y = r * cos(theta);

  beginShape(POINTS);
  for(let q of prev) {
    vertex(q[0], q[1]);
  }
  endShape();
  //print(prev);

  line(0, 0, 0, x, y, 0);
  fill(0);
  ellipse(x, y, 0, m, m, 0);

  for(let i = 0; i < iter_frame; i++){
    let num1 = - m * g * r * sin(theta);
    let num2 = - m * v_theta * 2 * r * v_r;
    let drag_term = -b * r * v_theta;
    let den = m * r * r;
    let a_theta = (num1 + num2 + drag_term) / den;

    num1 = - M * g + m * g * cos(theta);
    num2 = m * r * v_theta * v_theta;
    drag_term = -b * v_r;
    den = M + m;
    let a_r = (num1 + num2 + drag_term) / den;

    v_theta += a_theta * dt;
    theta += v_theta * dt;
    v_r += a_r * dt;
    r += v_r * dt;
  }

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

  //buffer.stroke(0);
  if (frameCount > 1) {
    // buffer.line(px, py, 0, x, y, 0);
    prev.push([x,y]);
    if(prev.length > 1000) prev.shift();
  }
  px = x;
  py = y;
  counter++;
  console.log(counter);
}
