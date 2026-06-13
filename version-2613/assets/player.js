(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('video[data-hls]');
        var button = shell.querySelector('[data-play-button]');
        var ready = false;
        var hls = null;

        if (!video || !button) {
            return;
        }

        function attach() {
            if (ready) {
                return;
            }

            var source = video.getAttribute('data-hls');

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                ready = true;
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                ready = true;
                return;
            }

            video.src = source;
            ready = true;
        }

        function playVideo() {
            attach();
            shell.classList.add('is-playing');

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', playVideo);

        video.addEventListener('click', function () {
            if (!ready) {
                playVideo();
            }
        });

        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });

        video.addEventListener('ended', function () {
            shell.classList.remove('is-playing');
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
