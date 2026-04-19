let bg1 = document.getElementById('bg1');
let bg2 = document.getElementById('bg2');
let show1 = true;

setInterval(function() {
  if (show1) {
    bg1.style.opacity = '0';
    bg2.style.opacity = '1';
  } else {
    bg1.style.opacity = '1';
    bg2.style.opacity = '0';
  }
  show1 = !show1;
}, 12000); 