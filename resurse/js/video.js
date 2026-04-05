const video = document.querySelector('#video-pagehaven video');

video.addEventListener('ended', () => {
  video.load();
});

video.addEventListener('mouseenter', () => {
  video.play();
});

video.addEventListener('mouseleave', () => {
  video.pause();
  video.load();
});