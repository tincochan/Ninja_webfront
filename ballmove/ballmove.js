(function() {
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  
    var field = document.getElementById("field");
    var center = document.getElementById("center");
    
    for(var i=0; i<10;i++){
    
      var b = document.createElement("div");
      b.className = "ball";
      field.appendChild(b);
   }
  
    field.style.height = window.innerHeight + "px";
    field.style.perspectiveOrigin = window.innerWidth/2 + "px "+ window.innerHeight/2 + "px";
  
    var maxX = window.innerWidth;
    var maxY = window.innerHeight;
    
    center.style.left = maxX/2+"px";
    center.style.bottom = maxY/2+"px";
  
    var gridSize = 150; // pixels
  
    var stretchFactor;
  
    var balls = document.getElementsByClassName("ball");
  
    for (var i = 0; i < balls.length; i++) {
      var ball = balls[i];
  
      ball.stretchFactor = 1 + Math.random() * 3;
   
      ball.angle1 = Math.random()*(1+1)-1;
      ball.angle2 = Math.random()*(1+1)-1;
      //ball.angle3 = Math.random()*(50+50)-50;   
      ball.angle3 = Math.random()*(1+1)-1;
  
      //ball.duration = Math.random() * (8 - 4) + 4;
      ball.duration = 4;
     
      ball.start = null;
    }
  
    function step(timestamp) {
      var progress, x, y, z;
  
      for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
  
        if (ball.start === null) {
          ball.start = timestamp;
        }
  
        ball.progress = (timestamp - ball.start) / ball.duration / 1000; // percent
  
        x = Math.sin(ball.progress * 2 * Math.PI);
        z = Math.cos(ball.progress * 2 * Math.PI);
  
        x = x * gridSize + maxX / 2;
        y = maxY / 2;
        z = z * gridSize;
        
        ball.style.left = maxX/2+ "px";
        ball.style.bottom = maxY/2 + "px";
        //ball.style.transform = "translateZ(" + z + "px" + ")";
        ball.style.transform = "rotate3d("+ball.angle1+","+ball.angle2+","+ball.angle3+","+ball.progress*360+"deg) translateX("+-gridSize+"px) "+"rotate3d("+ball.angle1+","+ball.angle2+","+ball.angle3+","+-ball.progress*360+"deg)";
  
        if (ball.progress >= 1) ball.start = null; // reset to start position
      }
  
      requestAnimationFrame(step);
    }
  
    requestAnimationFrame(step);
  })();
  