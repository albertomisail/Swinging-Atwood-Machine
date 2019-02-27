// constants
let M = 10;
let m = 10;
let g = 1;
let iter_frame = 5;
let dt = 1;

let theta = PI / 2;
let r = 10;
let pr = 0;
let ptheta = 0;

let cx, cy;
let buffer;
let px, py;

// sliders
let g_slider;
let m_slider;
let M_slider;

function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	cx = width / 2;
  cy = 50;
  buffer = createGraphics(width, height);
  buffer.background(175);
  buffer.translate(cx, cy);

	g_slider = createSlider(10, width / 3; g);
	g_slider.position(15, 15);
	m_slider = createSlider(10, width / 3, m);
	m_slider.position(g_slider.x, g_slider.y + g_slider.height + 10);
	M_slider = createSlider(10, width / 3, M);
	M_slider.position(m_slider.x, m_slider.y + m_slider.height + 10);
}

function draw() {
	// pull realtime values from sliders

	background(0);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);

	M = M_slider.value();
	m = m_slider.value();
	g = g_slider.value();
	let text_size = 12;
	strokeWeight(0);
	fill(0);
	textSize(text_size);
	text("m: "+ m, (m_slider.x + m_slider.width + 15), (m_slider.y + (m_slider.height / 2) + (text_size / 2)));
	text("M: "+ M, (M_slider.x + M_slider.width + 15), (M_slider.y + (M_slider.height / 2) + (text_size / 2)));
	text("gravity: "+ g, (g_slider.x + g_slider.width + 15), (g_slider.y + (g_slider.height / 2) + (text_size / 2)));

	translate(cx, cy);
  stroke(0);
  strokeWeight(2);

	// draw mass
	let x = r * cos(theta);
	let y = r * sin(theta);
	fill(0);
	ellipse(x, y, m, m);

	let i = 0;
	for(i = 0; i < iter_frame; i++){
		// calculate derivatives, formulas from paper
		let d_r = pr / (M + m);
		let d_theta = ptheta / (m * r * r);
		let d_pr = (ptheta * ptheta) / (m* r * r * r) - M * g * cos(theta);
		let d_ptheta = - m * g * r * sin(theta);

		// update values
		r += d_r * dt;
		theta += d_theta * dt;
		pr += d_pr * dt;
		ptheta += d_ptheta * dt;
	}

	// trace
	buffer.stroke(0);
  if (frameCount > 1) {
    buffer.line(px, py, x, y);
  }

	px = x;
	py = y;
}
