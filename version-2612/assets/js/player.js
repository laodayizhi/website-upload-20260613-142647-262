(function () {
    function setupPlayer(wrapper) {
        var video = wrapper.querySelector('video');
        var button = wrapper.querySelector('.play-overlay');
        if (!video || !button) {
            return;
        }
        function prepareVideo() {
            var source = video.getAttribute('data-src');
            if (!source || video.getAttribute('data-ready') === 'true') {
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                wrapper.hlsInstance = hls;
            } else {
                video.src = source;
            }
            video.setAttribute('data-ready', 'true');
        }
        function play() {
            prepareVideo();
            button.classList.add('is-hidden');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }
        button.addEventListener('click', play);
        wrapper.addEventListener('click', function (event) {
            if (event.target === wrapper) {
                play();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
    });
})();
