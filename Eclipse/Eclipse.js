window.onload = function(){
  var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
  

	var w = window.innerWidth;
	var h = window.innerHeight;
	canvas.width = w;
	canvas.height = h;
  
  var s = 500;
  var stars = [];
  
  for(var i=0;i<s;i++){
    stars.push({x:Math.random()*w,
                y:Math.random()*h,
                r:Math.random()+1,
                b:Math.random()});
  }
  
  function draw(){
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,w,h);
   
    ctx.beginPath();
    ctx.fillStyle="rgb(255, 204, 0)";
    
    for(var i=0;i<s;i++){
      var starAt = stars[i];
      ctx.moveTo(starAt.x, starAt.y);
      ctx.arc(starAt.x,starAt.y, starAt.r*Math.random(), 0, Math.PI*2, true);
      
    }
    ctx.fill();
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.arc(w/2,h/2-10,40,Math.PI*2,0,true);
    ctx.fillStyle="rgb(254, 252, 215)";
    ctx.fill();

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.arc(w/2-20,h/2-10,45,Math.PI*2,0,true);
    ctx.fillStyle="rgb(0,51,102)";
    ctx.fill();
    update();
  }
  
  
  function update(){
    var blur = 0;
    for(var i=0; i<s;i++){
      
     var ss = stars[i];
     if(i%3){
       ctx.shadowBlur = ss.b+Math.random()*119;
       ctx.shadowColor= "#ffffff";
       stars[i] = {x:ss.x,
                   y:ss.y,
                   r:ss.r,
                   b:ss.b+1};
     }else{
       ctx.shadowBlur = ss.b+3;
       ctx.shadowColor= "#ffffff";
       stars[i] = {x:ss.x,
                   y:ss.y,
                   r:ss.r*Math.random()+1,
                   b:ss.b};
     }
      
    }
      blur+=1;
  }
  draw();
}