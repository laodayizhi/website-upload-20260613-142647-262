import { H as Hls } from "./hls-dru42stk.js";

export function initMoviePlayer(videoSelector, triggerSelector, sourceUrl) {
  var video = document.querySelector(videoSelector);
  var trigger = document.querySelector(triggerSelector);
  var hls = null;
  var ready = false;

  if (!video || !trigger || !sourceUrl) {
    return;
  }

  function attachSource() {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }

    ready = true;
  }

  function startPlayback() {
    attachSource();
    trigger.classList.add("is-hidden");
    video.controls = true;
    var playTask = video.play();
    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function () {
        video.controls = true;
      });
    }
  }

  trigger.addEventListener("click", startPlayback);
  video.addEventListener("click", function () {
    if (!ready) {
      startPlayback();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
