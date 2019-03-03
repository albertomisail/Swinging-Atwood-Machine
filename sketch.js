let M = 10;
let m = 1;
let g = 1;

let r = 200;
let v_r = 0;
let theta = 0;
let v_theta = 0;

let dt = 0.001;

let iter_frame = 500;

let px = -1;
let py = -1;
let cx, cy;

let buffer;

let counter = 0;

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
}

function draw() {
  background(175);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);

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
		let den = m * r * r;
		let a_theta = (num1 + num2) / den;

		num1 = - M * g + m * g * cos(theta);
		num2 = m * r * v_theta * v_theta;
		den = M + m;
		let a_r = (num1 + num2) / den;

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
