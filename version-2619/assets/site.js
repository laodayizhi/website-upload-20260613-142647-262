(function () {
  function $(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initImages() {
    $('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      });
    });
  }

  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function initHero() {
    var slides = $('.hero-slide');
    var dots = $('.hero-dot');
    if (slides.length === 0) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function initFilters() {
    $('[data-filter-list]').forEach(function (list) {
      var scope = list.closest('[data-filter-scope]') || document;
      var cards = $('[data-movie-card]', list);
      var input = scope.querySelector('[data-filter-input]');
      var selects = $('[data-filter-select]', scope);
      var empty = scope.querySelector('[data-empty-state]');
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && input && !input.value) {
        input.value = q;
      }
      function apply() {
        var term = normalize(input ? input.value : '');
        var filters = {};
        selects.forEach(function (select) {
          filters[select.name] = normalize(select.value);
        });
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.tags
          ].join(' '));
          var ok = !term || haystack.indexOf(term) !== -1;
          Object.keys(filters).forEach(function (key) {
            var value = filters[key];
            if (!value) {
              return;
            }
            ok = ok && normalize(card.dataset[key]).indexOf(value) !== -1;
          });
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible === 0 ? 'block' : 'none';
        }
      }
      if (input) {
        input.addEventListener('input', apply);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
      apply();
    });
  }

  function attachStream(video) {
    if (!video || video.dataset.ready === '1') {
      return Promise.resolve();
    }
    var stream = video.dataset.stream;
    if (!stream) {
      return Promise.resolve();
    }
    video.dataset.ready = '1';
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video._hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else {
      video.src = stream;
    }
    return Promise.resolve();
  }

  function startPlayer(shell) {
    if (!shell) {
      return;
    }
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.play-overlay');
    attachStream(video).then(function () {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });
  }

  function initPlayers() {
    $('.play-overlay').forEach(function (button) {
      button.addEventListener('click', function () {
        startPlayer(button.closest('.player-shell'));
      });
    });
    $('[data-play-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = document.querySelector(button.getAttribute('data-play-target'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          startPlayer(target);
        }
      });
    });
    $('.movie-player').forEach(function (video) {
      video.addEventListener('play', function () {
        attachStream(video);
        var overlay = video.closest('.player-shell').querySelector('.play-overlay');
        if (overlay) {
          overlay.classList.add('hidden');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initImages();
    initNav();
    initHero();
    initFilters();
    initPlayers();
  });
})();
