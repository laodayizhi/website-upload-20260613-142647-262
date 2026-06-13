(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(function(shell) {
            var video = shell.querySelector("video");
            var button = shell.querySelector(".player-cover");
            var url = shell.getAttribute("data-video") || "";
            var started = false;
            var hlsInstance = null;

            function playVideo() {
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function() {});
                }
            }

            function start() {
                if (!video || !url) {
                    return;
                }
                shell.classList.add("is-playing");
                if (started) {
                    playVideo();
                    return;
                }
                started = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                    video.addEventListener("loadedmetadata", playVideo, { once: true });
                    video.load();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(url);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    return;
                }

                video.src = url;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                video.load();
            }

            if (button) {
                button.addEventListener("click", start);
            }
            shell.addEventListener("dblclick", start);
            video.addEventListener("play", function() {
                shell.classList.add("is-playing");
            });
            window.addEventListener("pagehide", function() {
                if (hlsInstance && typeof hlsInstance.destroy === "function") {
                    hlsInstance.destroy();
                }
            });
        });
    });
})();
