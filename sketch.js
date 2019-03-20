// constants
let M = 6;
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

let key_queue;

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
    for(let i = 0; i < iter_frame; i++){
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
          let r_aux = r + prev_c / 2;
          let theta_aux = theta + prev_d / 2;
          let p_r_aux = p_r + prev_e / 2;
          let p_theta_aux = p_theta + prev_f / 2;
          let phi_aux = phi + prev_g / 2;
          let p_phi_aux = p_phi + prev_h / 2;

          let c_j = dt * (p_r_aux) / (M+m);
          prev_c = c_j;
          c_arr.push(c_j);

          let d_j = dt * (p_theta_aux) / (m * r_aux * r_aux);
          prev_d = d_j;
          d_arr.push(d_j);

          let e_j = dt * (p_theta_aux * p_theta_aux / (m * r_aux * r_aux * r_aux) - M * g + m * g * cos(theta_aux) + p_phi_aux * p_phi_aux / (m * r_aux * r_aux * r_aux * sin(theta_aux) * sin(theta_aux)));
          prev_e = e_j;
          e_arr.push(e_j);

          let f_j = dt * (- m * g * r_aux * sin(theta_aux) + p_phi_aux * p_phi_aux * cos(theta_aux) / (m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux) * sin(theta_aux)));
          prev_f = f_j;
          f_arr.push(f_j);

          let g_j = dt * (p_phi_aux / (m * r_aux * r_aux * sin(theta_aux) * sin(theta_aux)));
          prev_g = g_j;
          g_arr.push(g_j);

          let h_j = 0;
          prev_h = h_j;
          h_arr.push(h_j);
        }

        // Runge-Kutta formulas
        r += (c_arr[0] + 2 * c_arr[1] + 2 * c_arr[2] + c_arr[3]) / 6;
        theta += (d_arr[0] + 2 * d_arr[1] + 2 * d_arr[2] + d_arr[3]) / 6;
        p_r += (e_arr[0] + 2 * e_arr[1] + 2 * e_arr[2] + e_arr[3]) / 6;
        p_theta += (f_arr[0] + 2 * f_arr[1] + 2 * f_arr[2] + f_arr[3]) / 6;
        phi += (g_arr[0] + 2 * g_arr[1] + 2 * g_arr[2] + g_arr[3]) / 6;
        p_phi += (h_arr[0] + 2 * h_arr[1] + 2 * h_arr[2] + h_arr[3]) / 6;
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
