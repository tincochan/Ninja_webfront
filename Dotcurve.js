let y;
let x;
let pos;
let prev;



function setup(){
  createCanvas(1000,1000)

  background(0);
  x = 200;
  y = 200;
  pos = createVector(200, 200)

}


function draw(){

  stroke(150);
  strokeWeight(2)
  ellipse(pos.x, pos.y, 10,10)

  var step = p5.Vector.random2D();

  pos.add(step)

}
