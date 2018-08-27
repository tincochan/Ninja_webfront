canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
W = canvas.width = 500;
H = canvas.height = 500;

var utils = {
  norm: function(value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function(value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },

  distance: function(p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceXY: function(x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circleCollision: function(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
  },

  circlePointCollision: function(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  },

  pointInRect: function(x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.radius) &&
      utils.inRange(y, rect.y, rect.y + rect.radius);
  },

  inRange: function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  },

  rangeIntersect: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function(r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  },

  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },

  radsToDegrees: function(radians) {
    return radians * 180 / Math.PI;
  },

  randomRange: function(min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  },

  getmiddle: function(p0, p1) {
    var x = p0.x,
      x2 = p1.x;
    middlex = (x + x2) / 2;
    var y = p0.y,
      y2 = p1.y;
    middley = (y + y2) / 2;
    return pos = [middlex, middley];
  },

  getAngle: function(p0, p1) {
    var deltaX = p1.x - p0.x;
    var deltaY = p1.y - p0.y;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
  },
  inpercentW: function(size) {
    return (size * W) / 100;
  },

  inpercentH: function(size) {
    return (size * H) / 100;
  },

}

function randomLine(x, y, color) {
  this.x = x;
  this.y = y;
  this.radius =4;
  this.angle = utils.degreesToRads(45);
  this.long = 2;
  this.color = color;

  this.getRandom = function() {
    random = utils.randomInt(0, 1);

    if (random === 0) {
      return "+";
    } else {
      return "-";
    }

  };

  this.addPoint = function(long) {

    oldPos = {
      x: this.x,
      y: this.y
    };

    rX = this.getRandom();
    rY = this.getRandom();
    this.angle = utils.randomRange(utils.degreesToRads(0), utils.degreesToRads(360));
    this.long = long;

    this.x = this.rotate("x", rX);
    this.y = this.rotate("y", rY);

    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {

      this.x = oldPos.x;
      this.y = oldPos.y;

    } else {
    ctx.globalAlpha =.05;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(oldPos.x, oldPos.y);
      ctx.stroke();
      ctx.closePath();
    ctx.globalAlpha =1;

      ctx.beginPath();
      ctx.fillStyle="black";
      ctx.arc(this.x, this.y,1,0, 2*Math.PI);
      ctx.closePath();
      
    }

  };

  this.rotate = function(axe, sens) {

    if (axe === "x") {
      return this.x + Math.cos(eval(this.angle + sens + Math.PI / 2)) * this.long;

    } else {
      return this.y + Math.sin(eval(this.angle + sens + Math.PI / 2)) * this.long;
    }

  }

}
/*
ctx.fillStyle = "#d7d7d7";
ctx.font = "70px Arial";
ctx.textAlign = "center";
ctx.fillText("Cloud", W / 2, 120);*/

lineStock = [];

for(i=0; i < 20;i++ ){
  lineStock.push(new randomLine(utils.randomRange(0,W),utils.randomRange(0,H), "#3d5fff"));
}

update();

function update() {
  //  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "silver";
  
for(i=0; i < lineStock.length;i++ ){
for(a=0; a < 10;a++ ){

  lineStock[i].addPoint(utils.randomRange(2,1));
  
  
}
}
  requestAnimationFrame(update);
}