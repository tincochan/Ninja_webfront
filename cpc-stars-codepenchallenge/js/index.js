
function addLoader(){
   var loader=document.getElementById('loader');
 loader.style.height="100vh";
 loader.style.display="flex";
 loader.style.justifyContent="center";
 loader.style.alignItems="center";
  var x="";
for(var i=1;i<13;i++)
{ x+="<div style='filter:hue-rotate(" + i*30 + "deg);-webkit-animation:move 1.5s " + .15*i + "s cubic-bezier(.3, .2, .1, 1) alternate infinite;' class='star C-" + i + "'>☀️</div>"};

 loader.innerHTML=x;}
addLoader();