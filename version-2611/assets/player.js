(function () {
  function mount(playerId, streamUrl) {
    var root = document.getElementById(playerId);

    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var startButton = root.querySelector(".player-start");
    var started = false;
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function connect() {
      if (started) {
        return;
      }

      started = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function startPlayback() {
      connect();
      root.classList.add("is-playing");

      if (cover) {
        cover.setAttribute("hidden", "hidden");
      }

      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          root.classList.remove("is-playing");

          if (cover) {
            cover.removeAttribute("hidden");
          }
        });
      }
    }

    if (startButton) {
      startButton.addEventListener("click", startPlayback);
    }

    if (cover) {
      cover.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (!started || video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.StaticPlayer = {
    mount: mount
  };
})();
