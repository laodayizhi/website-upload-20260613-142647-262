import { H as Hls } from './hls-dru42stk.js';

var players = new WeakMap();

function prepare(video) {
  if (players.has(video)) {
    return players.get(video);
  }

  var src = video.getAttribute('data-hls');
  var hls = null;

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      if (video.getAttribute('data-started') === '1') {
        var action = video.play();

        if (action && typeof action.catch === 'function') {
          action.catch(function () {});
        }
      }
    });
  }

  players.set(video, hls || true);
  return hls || true;
}

function start(shell) {
  var video = shell.querySelector('video');

  if (!video) {
    return;
  }

  video.setAttribute('data-started', '1');
  prepare(video);
  shell.classList.add('is-playing');

  var action = video.play();

  if (action && typeof action.catch === 'function') {
    action.catch(function () {});
  }
}

Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
  var cover = shell.querySelector('.player-cover');
  var video = shell.querySelector('video');

  if (cover) {
    cover.addEventListener('click', function () {
      start(shell);
    });
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start(shell);
      }
    });
  }
});
