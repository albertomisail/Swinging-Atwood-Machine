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

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Issue with wrong rendering on a retina Mac. See issue: https://github.com/CodingTrain/website/issues/574
  pixelDensity(1);
  theta = PI / 2;
  cx = windowWidth / 2;
  cy = windowHeight / 3;
  buffer = createGraphics(windowWidth, windowHeight);
  buffer.background(175);
  buffer.translate(cx, cy);

  g_slider = createSlider(0, 20, g, 0.1);
	g_slider.position(15, 15);
	m_slider = createSlider(0, 10, m);
	m_slider.position(g_slider.x, g_slider.y + g_slider.height + 10);
	M_slider = createSlider(0, 20, M);
	M_slider.position(m_slider.x, m_slider.y + m_slider.height + 10);
  b_slider = createSlider(0, 10, b);
  b_slider.position(M_slider.x, M_slider.y + M_slider.height + 10);
}

function draw() {
  background(175);
  imageMode(CORNER);
  image(buffer, 0, 0, windowWidth, windowHeight);

  M = M_slider.value();
	m = m_slider.value();
	g = g_slider.value();
  b = b_slider.value();
	let text_size = 12;
	strokeWeight(0);
	fill(0);
	textSize(text_size);
	text("m: "+ m, (m_slider.x + m_slider.width + 15), (m_slider.y + (m_slider.height / 2) + (text_size / 2)));
	text("M: "+ M, (M_slider.x + M_slider.width + 15), (M_slider.y + (M_slider.height / 2) + (text_size / 2)));
	text("gravity: "+ g, (g_slider.x + g_slider.width + 15), (g_slider.y + (g_slider.height / 2) + (text_size / 2)));
  text("damping: "+ b, (b_slider.x + b_slider.width + 15), (b_slider.y + (b_slider.height / 2) + (text_size / 2)));

	translate(cx, cy);
	stroke(0);
	strokeWeight(2);

	let x = r * sin(theta);
	let y = r * cos(theta);

	line(0, 0, x, y);
	fill(0);
	ellipse(x, y, m, m);

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

  buffer.stroke(0);
  if (frameCount > 1) {
    buffer.line(px, py, x, y);
  }

  px = x;
  py = y;
	counter++;

	console.log(counter);
}
