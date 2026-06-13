(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var index = 0;

    function showHero(next) {
      if (!slides.length) {
        return;
      }

      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showHero(i);
      });
    });

    showHero(0);
    window.setInterval(function () {
      showHero(index + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var empty = document.querySelector('[data-filter-empty]');

  function applyFilter() {
    var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = regionSelect ? regionSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var title = card.getAttribute('data-title') || '';
      var cardRegion = card.getAttribute('data-region') || '';
      var cardType = card.getAttribute('data-type') || '';
      var matched = true;

      if (q && title.indexOf(q) === -1) {
        matched = false;
      }

      if (region && region !== cardRegion) {
        matched = false;
      }

      if (type && type !== cardType) {
        matched = false;
      }

      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  [filterInput, regionSelect, typeSelect].forEach(function (node) {
    if (node) {
      node.addEventListener('input', applyFilter);
      node.addEventListener('change', applyFilter);
    }
  });

  var searchBox = document.querySelector('[data-search-box]');
  var searchRegion = document.querySelector('[data-search-region]');
  var searchType = document.querySelector('[data-search-type]');
  var searchResults = document.querySelector('[data-search-results]');

  function cardTemplate(movie) {
    return [
      '<a class="movie-card" href="' + movie.url + '">',
      '  <span class="card-poster">',
      '    <img src="' + movie.image + '" alt="' + movie.title + '" loading="lazy">',
      '    <span class="play-float">▶</span>',
      '    <span class="meta-ribbon">' + movie.region + ' · ' + movie.year + '</span>',
      '  </span>',
      '  <span class="card-body">',
      '    <span class="genre-line">' + movie.genre + '</span>',
      '    <strong>' + movie.title + '</strong>',
      '    <span class="card-stats"><span>★ ' + movie.rating + '</span><span>' + movie.views + '</span></span>',
      '    <span class="one-line">' + movie.oneLine + '</span>',
      '  </span>',
      '</a>'
    ].join('');
  }

  function renderSearch() {
    if (!searchResults || !window.SITE_SEARCH_DATA) {
      return;
    }

    var query = searchBox ? searchBox.value.trim().toLowerCase() : '';
    var region = searchRegion ? searchRegion.value : '';
    var type = searchType ? searchType.value : '';
    var data = window.SITE_SEARCH_DATA.filter(function (movie) {
      var text = (movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.genre + ' ' + movie.tags + ' ' + movie.oneLine).toLowerCase();
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (region && movie.region !== region) {
        matched = false;
      }

      if (type && movie.type !== type) {
        matched = false;
      }

      return matched;
    }).slice(0, 96);

    if (!data.length) {
      searchResults.innerHTML = '<div class="filter-empty is-visible">没有找到匹配影片</div>';
      return;
    }

    searchResults.innerHTML = '<div class="grid-cards">' + data.map(cardTemplate).join('') + '</div>';
  }

  if (searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');

    if (initial && searchBox) {
      searchBox.value = initial;
    }

    [searchBox, searchRegion, searchType].forEach(function (node) {
      if (node) {
        node.addEventListener('input', renderSearch);
        node.addEventListener('change', renderSearch);
      }
    });

    renderSearch();
  }
})();
