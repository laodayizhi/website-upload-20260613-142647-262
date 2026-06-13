/* Static movie site interactions: readable, non-minified. */
(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initMobileMenu() {
    var button = qs('[data-mobile-menu-button]');
    var nav = qs('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHeroCarousel() {
    var root = qs('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = qsa('[data-hero-slide]', root);
    var dots = qsa('[data-hero-dot]', root);
    var prev = qs('[data-hero-prev]', root);
    var next = qs('[data-hero-next]', root);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
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

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
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

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initCatalogFilter() {
    var input = qs('[data-filter-input]');
    var scope = qs('[data-filter-scope]');
    var counter = qs('[data-filter-count]');
    if (!input || !scope) {
      return;
    }
    var cards = qsa('[data-movie-card]', scope);

    function applyFilter() {
      var keyword = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' '));
        var matched = !keyword || text.indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (counter) {
        counter.textContent = '显示 ' + visible + ' 部影片';
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  }

  function initPlayer() {
    var video = qs('[data-player-video]');
    var button = qs('[data-player-start]');
    var status = qs('[data-player-status]');
    if (!video || !button) {
      return;
    }

    var primaryUrl = video.getAttribute('data-src');
    var fallbackUrl = video.getAttribute('data-fallback');
    var hlsInstance = null;
    var fallbackUsed = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function attachSource(sourceUrl) {
      if (!sourceUrl) {
        setStatus('没有可用播放源。');
        return;
      }

      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
        hlsInstance = null;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('HLS 播放源已加载，可正常播放。');
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && fallbackUrl && !fallbackUsed) {
            fallbackUsed = true;
            setStatus('主播放源暂不可用，正在切换备用 HLS 播放源。');
            attachSource(fallbackUrl);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        setStatus('浏览器原生 HLS 播放源已加载。');
      } else {
        video.src = fallbackUrl || sourceUrl;
        setStatus('当前浏览器不支持 HLS.js，已尝试使用视频标签直接播放。');
      }
    }

    button.addEventListener('click', function () {
      attachSource(primaryUrl);
      video.play().catch(function () {
        setStatus('播放源已加载，请再次点击播放器播放。');
      });
    });
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function movieCardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card" data-movie-card>',
      '  <a class="movie-poster-link" href="' + movie.page + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
      '    <img class="movie-poster" src="' + movie.poster + '" alt="' + escapeHtml(movie.title) + '封面" loading="lazy">',
      '    <span class="poster-shade"></span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="' + movie.page + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.one_line || '') + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return (value || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initSearchPage() {
    var app = qs('#movie-search-app');
    if (!app || !window.MOVIES) {
      return;
    }

    var keywordInput = qs('#search-keyword');
    var typeInput = qs('#search-type');
    var yearInput = qs('#search-year');
    var resetButton = qs('#search-reset');
    var count = qs('#search-count');
    var results = qs('#search-results');
    var initialKeyword = getQueryParam('q');

    if (keywordInput && initialKeyword) {
      keywordInput.value = initialKeyword;
    }

    function render() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var type = normalize(typeInput && typeInput.value);
      var year = normalize(yearInput && yearInput.value);
      var matched = window.MOVIES.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.category,
          (movie.tags || []).join(' '),
          movie.one_line
        ].join(' '));
        var typeMatched = !type || normalize(movie.type).indexOf(type) !== -1;
        var yearMatched = !year || normalize(movie.year).indexOf(year) !== -1;
        var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
        return typeMatched && yearMatched && keywordMatched;
      });

      if (count) {
        count.textContent = '共找到 ' + matched.length + ' 部影片，当前展示前 120 部。';
      }
      if (results) {
        results.innerHTML = matched.slice(0, 120).map(movieCardTemplate).join('');
      }
    }

    [keywordInput, typeInput, yearInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', render);
        input.addEventListener('change', render);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (keywordInput) keywordInput.value = '';
        if (typeInput) typeInput.value = '';
        if (yearInput) yearInput.value = '';
        render();
      });
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeroCarousel();
    initCatalogFilter();
    initPlayer();
    initSearchPage();
  });
})();
