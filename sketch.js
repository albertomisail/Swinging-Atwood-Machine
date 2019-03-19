// constants
let M = 3;
let m = 1;
let g = 9.81;
let b = 0;
let dt = 0.01;

// variables
let r = 200;
let theta = 0;
let phi = 0;
let p_r = 0;
let p_theta = 0;
let p_phi = 0.001;

let iter_frame = 50;

let x, y, z;

let update = false;

// sliders
let g_slider;
let m_slider;
let M_slider;
let b_slider;

let prev;

let cam_pos, cam_up, cam_right;

// buttons, text
let g_text, m_text, M_text, b_text;
let g_box, m_box, M_box, b_box;
let g_enter, m_enter, M_enter, b_enter;
let text_size = 12;
let start_button;

let alpha=0, beta=0;

let lastMouseX, lastMouseY, lastMouseP = 0;
let sliderX, sliderY;

let keyval = 0;

if (!Array.prototype.back){
  Array.prototype.back = function() {
    return this[this.length - 1];
  };
};

class Queue {
  constructor() {
    this.inq = [];
    this.outq = [];
  }
  push(item) {
    this.inq.push(item)
  }
  pre() {
    if(this.outq.length != 0) {
      return true;
    }
    if(this.outq.length == 0 && this.inq.length != 0) {
      while(this.inq.length != 0) {
        this.outq.push(this.inq.pop());
      }
      return true;
    }
    return false;
  }
  front() {
    if(this.pre()) {
      return this.outq.back();
    }
    return null;
  }
  pop() {
    if(this.pre()) {
      return this.outq.pop();
    }
    return null;
  }
  size() {
    return this.outq.length + this.inq.length;
  }
  clear() {
    this.outq = [];
    this.inq = [];
  }
  runOn(func) {
    for(let i=this.outq.length-1; i>=0; --i) {
      func(this.outq[i]);
    }
    for(let i=0; i<this.inq.length; ++i) {
      func(this.inq[i]);
    }
  }
}

let key_queue;

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

function setup() {
  createCanvas(800, 600, WEBGL);
  pixelDensity(1);
  theta = PI / 2;
  phi = PI / 2;

  pg = createGraphics(800, 600);

  cam_pos = createVector(1, 0, 0);
  cam_up = createVector(0, 0, -1);
  cam_right = createVector(0, -1, 0);

  key_queue = new Queue();
  prev = new Queue();

  setupSliders();
  // setupInputs();
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
      let rotx = new Rotation(cam_up, -alpha/2);
      let roty = new Rotation(cam_right, beta/2);
      let rot = rotx.rotate(roty);
      rot = rot.rotate(roty);
      rot = rot.rotate(rotx);
      cam_up = rot.rotate(cam_up);
      cam_right = rot.rotate(cam_right);
      cam_pos = rot.rotate(cam_pos);
      /*
      cam_up = rotx.rotate(cam_up);
      cam_up = roty.rotate(cam_up);
      cam_right = rotx.rotate(cam_right);
      cam_right = roty.rotate(cam_right);
      cam_pos = rotx.rotate(cam_pos);
      cam_pos = roty.rotate(cam_pos); */
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastMouseP = mouseIsPressed;
  } else {
    lastMouseP = 0;
  }
}

function setupSliders(){
  g_slider = createSlider(0, 20, g, 0.01);
  m_slider = createSlider(0, 10, m, 0.01);
  M_slider = createSlider(0, 20, M, 0.01);
  b_slider = createSlider(0, 10, b, 0.01);
  g_text = createSpan("");
  M_text = createSpan("");
  m_text = createSpan("");
  b_text = createSpan("");
  m_text.html("m: ");
  M_text.html("M: ");
  g_text.html("gravity: ");
  b_text.html("damping: ");
  g_box = createInput();
  m_box = createInput();
  M_box = createInput();
  b_box = createInput();
  g_box.value(g);
  m_box.value(m);
  M_box.value(M);
  b_box.value(b);
  g_box.size(40, g_text.height);
  m_box.size(40, g_text.height);
  M_box.size(40, g_text.height);
  b_box.size(40, g_text.height);
  g_text.position(15, 15);
  g_box.position(90, g_text.y);
  g_slider.position(g_text.x, g_text.y + g_text.height + 10);
  m_text.position(g_slider.x, g_slider.y + g_slider.height + 10 );
  m_box.position(90, m_text.y);
  m_slider.position(g_slider.x, m_text.y + m_text.height + 10);
  M_text.position(m_slider.x, m_slider.y + m_slider.height + 10 );
  M_box.position(90, M_text.y);
  M_slider.position(m_slider.x, M_text.y + M_text.height + 10);
  b_text.position(M_slider.x, M_slider.y + M_slider.height + 10 );
  b_box.position(90, b_text.y);
  b_slider.position(M_slider.x, b_text.y + b_text.height + 10);

  m_enter = false;
  M_enter = false;
  g_enter = false;
  b_enter = false;
  m_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      m_enter = true;
    }
  });
  M_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      M_enter = true;
    }
  });
  g_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      g_enter = true;
    }
  });
  b_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      b_enter = true;
    }
  });

  sliderX = M_slider.x+m_slider.width+100;
  sliderY = b_slider.y + b_slider.height+10;

  start_button = createButton();
  start_button.position(M_slider.x, b_slider.y+b_slider.height+10);
  start_button.html("start");
  start_button.mousePressed(toggleSketch);
}

function toggleSketch() {
  if(update) {
    start_button.html("start");
    update = false;
  } else {
    start_button.html("stop");
    update = true;
  }
}

let counter = 0;
function draw() {
  if(true){
    background(175);

    drawSliders();
    stroke(0);
    strokeWeight(2);

    x = r * sin(theta) * cos(phi);
    y = r * sin(theta) * sin(phi);
    z = -r * cos(theta);

    positionCamera();

    initialPositioning();
    calculateNewPosition();
    drawTransition();
    counter++;
  }
}

function drawSliders(){
  if(M_slider.value() != M) {
    M = M_slider.value();
  } else if((M_box.value() != M && M_box.elt !== document.activeElement) || M_enter) {
    M_enter = false;
    M = parseFloat(M_box.value());
  }
  
  if(m_slider.value() != m) {
    m = m_slider.value();
  } else if((m_box.value() != m && m_box.elt !== document.activeElement) || m_enter) {
    m_enter = false;
    m = parseFloat(m_box.value());
  }
  
  if(g_slider.value() != g) {
    g = g_slider.value();
  } else if((g_box.value() != g && g_box.elt !== document.activeElement) || g_enter) {
    g_enter = false;
    g = parseFloat(g_box.value());
  }

  if(b_slider.value() != b) {
    b = b_slider.value();
  } else if((b_box.value() != b && b_box.elt !== document.activeElement) || b_enter) {
    b_enter = false;
    b = parseFloat(b_box.value());
  }
  m_slider.value(m);
  M_slider.value(M);
  g_slider.value(g);
  b_slider.value(b);
  if(m_box.elt !== document.activeElement) {
    m_box.value(m);
  }
  if(M_box.elt !== document.activeElement) {
    M_box.value(M);
  }
  if(g_box.elt !== document.activeElement) {
    g_box.value(g);
  }
  if(b_box.elt !== document.activeElement) {
    b_box.value(b);
  }
}

function calculateNewPosition(){
  if(update) {
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
      p_r += (e0 + 2 * e1 + 2 * e2 + e3) / 6;
      p_theta += (f0 + 2 * f1 + 2 * f2 + f3) / 6;
      phi += (g0 + 2 * g1 + 2 * g2 + g3) / 6;
      p_phi += (h0 + 2 * h1 + 2 * h2 + h3) / 6;
    }
  }
}

function drawTransition(){
  beginShape(POINTS);
  prev.runOn(function(q) {
    vertex(q[0], q[1], q[2]);
  });
  endShape();
  if (frameCount > 1) {
    prev.push([x,y,z]);
    if(prev.length > 1000000) prev.pop();
  }
}

function initialPositioning() {
  if(!update) {
    x = r * sin(theta) * cos(phi);
    y = r * sin(theta) * sin(phi);
    z = -r * cos(theta);
    while(key_queue.size() > 0) {
      prev = new Queue();
      key_code = key_queue.pop();
      switch(key_code) {
        case 37: r -= 10; break;
        case 38: theta += 0.1; break;
        case 39: r += 10; break;
        case 40: theta -= 0.1; break;
        case 65: ; break;
        case 68: ; break;
        case 70: ; break;
        case 83: ; break;
      }
    }
  } else {
    key_queue.clear();
  }
}

function keyPressed() {
  console.log(keyCode);
  if(keyCode == 32) {
    toggleSketch();
  } else {
    key_queue.push(keyCode);
  }
}

