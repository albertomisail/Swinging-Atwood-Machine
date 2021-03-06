let update = false;

// sliders
let g_slider;
let m_slider;
let M_slider;
let b_slider;
let f_slider;
let l_slider;

let prev;

let cam_pos, cam_up, cam_right;

// buttons, text
let g_text, m_text, M_text, b_text, f_text, l_text;
let g_box, m_box, M_box, b_box, f_box, l_box;
let g_enter, m_enter, M_enter, b_enter, f_enter, l_enter;
let text_size = 12;
let start_button, reset_button;

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

let pendulum;
let reset_values;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  pg = createGraphics(800, 600);

  cam_pos = createVector(1, 0, 0);
  cam_up = createVector(0, 0, -1);
  cam_right = createVector(0, -1, 0);

  pendulum = new Pendulum();
  key_queue = new Queue();

  reset_values = false;
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
  g_slider = createSlider(0, 20, pendulum.g, 0.01);
  m_slider = createSlider(0, 10, pendulum.m, 0.01);
  M_slider = createSlider(0, 20, pendulum.M, 0.001);
  b_slider = createSlider(0, 10, pendulum.b, 0.01);
  f_slider = createSlider(0, 3, pendulum.f, 0.01);
  l_slider = createSlider(0, 0.001, pendulum.p_phi, 0.0001);

  g_text = createSpan("");
  M_text = createSpan("");
  m_text = createSpan("");
  b_text = createSpan("");
  f_text = createSpan("");
  l_text = createSpan("");

  m_text.html("m: ");
  M_text.html("M: ");
  g_text.html("gravity: ");
  b_text.html("damping: ");
  f_text.html("forcing: ");
  l_text.html("angular momentum: ");

  m_text.addClass("rangelabel");
  M_text.addClass("rangelabel");
  g_text.addClass("rangelabel");
  b_text.addClass("rangelabel");
  f_text.addClass("rangelabel");
  l_text.addClass("rangelabel");

  g_box = createInput();
  m_box = createInput();
  M_box = createInput();
  b_box = createInput();
  f_box = createInput();
  l_box = createInput();

  g_box.value(pendulum.g);
  m_box.value(pendulum.m);
  M_box.value(pendulum.M);
  b_box.value(pendulum.b);
  f_box.value(pendulum.f);
  l_box.value(pendulum.p_phi);

  g_box.size(40, g_text.height);
  m_box.size(40, g_text.height);
  M_box.size(40, g_text.height);
  b_box.size(40, g_text.height);
  f_box.size(40, g_text.height);
  l_box.size(40, g_text.height);

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

  f_text.position(b_slider.x, b_slider.y + b_slider.height + 10 );
  f_box.position(90, f_text.y);
  f_slider.position(b_slider.x, f_text.y + f_text.height + 10);

  l_text.position(f_slider.x, f_slider.y + f_slider.height + 10 );
  l_box.position(90, l_text.y);
  l_slider.position(f_slider.x, l_text.y + l_text.height + 10);

  m_enter = false;
  M_enter = false;
  g_enter = false;
  b_enter = false;
  f_enter = false;
  l_enter = false;

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
  f_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      f_enter = true;
    }
  });
  l_box.elt.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
      l_enter = true;
    }
  });


  sliderX = M_slider.x+m_slider.width+100;
  sliderY = l_slider.y + l_slider.height+10;

  start_button = createButton();
  start_button.html("start");
  start_button.position(M_slider.x, l_slider.y+l_slider.height+10);
  start_button.mousePressed(toggleSketch);

  reset_button = createButton();
  reset_button.html("reset");
  reset_button.position(start_button.x+start_button.width+10, start_button.y);
  reset_button.mousePressed(resetButton);

  message_text = createSpan();
  message_text.html("Arrow keys alter position, asdw alters velocity");
  message_text.class("rangelabel");
  message_text.position(g_slider.x+g_slider.width+10, g_slider.y-15);
}

function toggleSketch() {
  if(update) {
    start_button.html("start");
    update = false;
    message_text.style("visibility: visible;");
  } else {
    start_button.html("stop");
    update = true;
    message_text.style("visibility: hidden;");
  }
}
function resetButton() {
  if(update) {
    toggleSketch();
  }
  reset_values = true;
  pendulum = new Pendulum();
  loadToSliders();
  reset_values = false;
}

function loadToSliders() {
  g_slider.value(pendulum.g);
  m_slider.value(pendulum.m);
  M_slider.value(pendulum.M);
  b_slider.value(pendulum.b);
  f_slider.value(pendulum.f);
  l_slider.value(pendulum.p_phi);

  g_box.value(pendulum.g);
  m_box.value(pendulum.m);
  M_box.value(pendulum.M);
  b_box.value(pendulum.b);
  f_box.value(pendulum.f);
  l_box.value(pendulum.p_phi);
}

let counter = 0;
function draw() {
  if(true){
  background(20);

  drawSliders();
  stroke(0);
  strokeWeight(2);

  positionCamera();

  ambientLight(100, 100, 100);
  pointLight(250, 250, 250, 1000, 1000, 100);

  push();
  ambientMaterial(color(204, 42, 0));
  noStroke();
  translate(-130, 0, -170);
  box(200, 100, 20);
  pop();

  initialPositioning();
  calculateNewPosition();
  // console.log(counter);
  drawTransition();
  counter++;
  }
  push();
  translate(-49, 0, -85);
  rotateZ(PI/2);
  rotateX(2*PI/3);
  noStroke();
  ambientMaterial(color(204, 42, 0));
  cone(10, 198);
  pop();

  push();
  translate(-201, 0, -85);
  rotateZ(PI/2);
  rotateX(PI/3);
  noStroke();
  ambientMaterial(color(204, 42, 0));
  cone(10, 198);
  pop();

  stroke(color(0,0,0));
}

function drawSliders(){
  if(reset_values) {
    return;
  }
  if(M_slider.value() != pendulum.M) {
    pendulum.M = M_slider.value();
  } else if((M_box.value() != pendulum.M && M_box.elt !== document.activeElement) || M_enter) {
    M_enter = false;
    pendulum.M = parseFloat(M_box.value());
  }

  if(m_slider.value() != pendulum.m) {
    pendulum.m = m_slider.value();
  } else if((m_box.value() != pendulum.m && m_box.elt !== document.activeElement) || m_enter) {
    m_enter = false;
    pendulum.m = parseFloat(m_box.value());
  }

  if(g_slider.value() != pendulum.g) {
    pendulum.g = g_slider.value();
  } else if((g_box.value() != pendulum.g && g_box.elt !== document.activeElement) || g_enter) {
    g_enter = false;
    pendulum.g = parseFloat(g_box.value());
  }

  if(b_slider.value() != pendulum.b) {
    pendulum.b = b_slider.value();
  } else if((b_box.value() != pendulum.b && b_box.elt !== document.activeElement) || b_enter) {
    b_enter = false;
    pendulum.b = parseFloat(b_box.value());
  }

  if(f_slider.value() != pendulum.f) {
    pendulum.f = f_slider.value();
  } else if((f_box.value() != pendulum.f && f_box.elt !== document.activeElement) || f_enter) {
    f_enter = false;
    pendulum.f = parseFloat(f_box.value());
  }

  if(l_slider.value() != pendulum.p_phi) {
    pendulum.p_phi = l_slider.value();
  } else if((l_box.value() != pendulum.p_phi && l_box.elt !== document.activeElement) || l_enter) {
    l_enter = false;
    pendulum.p_phi = parseFloat(l_box.value());
  }

  m_slider.value(pendulum.m);
  M_slider.value(pendulum.M);
  g_slider.value(pendulum.g);
  b_slider.value(pendulum.b);
  f_slider.value(pendulum.f);
  l_slider.value(pendulum.p_phi);
  if(m_box.elt !== document.activeElement) {
    m_box.value(pendulum.m);
  }
  if(M_box.elt !== document.activeElement) {
    M_box.value(pendulum.M);
  }
  if(g_box.elt !== document.activeElement) {
    g_box.value(pendulum.g);
  }
  if(b_box.elt !== document.activeElement) {
    b_box.value(pendulum.b);
  }
  if(f_box.elt !== document.activeElement) {
    f_box.value(pendulum.f);
  }
  if(l_box.elt !== document.activeElement) {
    l_box.value(pendulum.p_phi);
  }
}

function calculateNewPosition(){
  if(update) {
    pendulum.calculateNewPosition();
  }

  push();
  stroke(color(200, 0, 0));
  beginShape(POINTS);
  noFill();
  vertex(pendulum.x(), pendulum.y(), pendulum.z());
  vertex(0, 0, 0);
  vertex(-250, 0, 0);
  let bigz = -pendulum.len + pendulum.r + 250;
  if(bigz > 0) {
    bigz = 0;
  }
  vertex(-250, 0, bigz);
  endShape();
  pop();

  push();
  translate(-250, 0, bigz);
  noStroke();
  ambientMaterial(color(210, 180, 140));
  sphere(4*pendulum.M);
  pop();

  //texture(woodtexture);
  push();
  noStroke();
  ambientMaterial(color(210, 180, 140));
  translate(pendulum.x(), pendulum.y(), pendulum.z());
  sphere(6*pendulum.m);
  pop();

  push();
  stroke(color(0, 0, 200));
  let pr = pendulum.drhat().mult(pendulum.p_r/5).add(pendulum.pos());
  let pt = pendulum.dthetahat().mult(pendulum.p_theta/200).add(pendulum.pos());
  let pp = pendulum.dphihat().mult(pendulum.p_phi).add(pendulum.pos());
  line(pendulum.x(), pendulum.y(), pendulum.z(), pr.x, pr.y, pr.z);
  line(pendulum.x(), pendulum.y(), pendulum.z(), pt.x, pt.y, pt.z);
  //line(pendulum.x(), pendulum.y(), pendulum.z(), pp.x, pp.y, pp.z);
  pop();

  stroke(color(0,0,0));
}

function drawTransition(){
  beginShape(POINTS);
  stroke(color(160, 160, 150));
  pendulum.prev.runOn(function(q) {
    vertex(q[0], q[1], q[2]);
  });
  endShape();
  if (frameCount > 1) {
    pendulum.addXYZ();
    if(pendulum.prev.length > 1000000) pendulum.prev.pop();
  }
}

function initialPositioning() {
  if(!update) {
    // x = r * sin(theta) * cos(phi);
    // y = r * sin(theta) * sin(phi);
    // z = -r * cos(theta);
    while(key_queue.size() > 0) {
      pendulum.prev = new Queue();
      key_code = key_queue.pop();
      switch(key_code) {
        case 37: pendulum.r -= 10; break;
        case 38: pendulum.theta += 0.1; break;
        case 39: pendulum.r += 10; break;
        case 40: pendulum.theta -= 0.1; break;
        case 65: pendulum.p_r -= 30; break;
        case 68: pendulum.p_r += 30; break;
        case 87: pendulum.p_theta += 1000; break;
        case 83: pendulum.p_theta -= 1000; break;
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
