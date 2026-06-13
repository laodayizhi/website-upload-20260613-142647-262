(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var previous = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer;

    function show(target) {
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    if (previous) {
      previous.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  function normalize(text) {
    return (text || '').toString().trim().toLowerCase();
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('.filter-input'));
    if (!inputs.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    inputs.forEach(function (input) {
      if (q && input.classList.contains('autofocus')) {
        input.value = q;
      }
      var scope = document.querySelector('.filter-scope');
      var empty = document.querySelector('.empty-state');
      var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('.movie-card')) : [];
      function filter() {
        var value = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-filter'));
          var ok = !value || haystack.indexOf(value) !== -1;
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }
      input.addEventListener('input', filter);
      filter();
      if (input.classList.contains('autofocus')) {
        input.focus();
      }
    });
  }

  function setupPlayer() {
    var video = document.getElementById('movie-video');
    var box = document.getElementById('movie-player');
    var cover = document.querySelector('.play-cover');
    if (!video || !box) {
      return;
    }
    var url = video.getAttribute('data-video');
    var loaded = false;

    function attach() {
      if (loaded || !url) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            box.classList.add('has-error');
          }
        });
      } else {
        video.src = url;
      }
    }

    function play() {
      attach();
      box.classList.add('is-playing');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          box.classList.remove('is-playing');
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }
    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        box.classList.remove('is-playing');
      }
    });
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
