(function() {
  var input = document.querySelector('[data-search-input]');
  var button = document.querySelector('[data-search-button]');
  var results = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-search-empty]');
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  if (input) {
    input.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + movie.url + '">' +
      '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-badge">' + escapeHtml(movie.type) + '</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<div class="meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.summary) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function(ch) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      })[ch];
    });
  }

  function runSearch() {
    if (!results || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    var keyword = normalize(input && input.value);
    var found = window.MOVIE_SEARCH_DATA.filter(function(movie) {
      if (!keyword) {
        return true;
      }
      var text = normalize([
        movie.title,
        movie.genre,
        movie.year,
        movie.region,
        movie.type,
        movie.summary,
        (movie.tags || []).join(' ')
      ].join(' '));
      return text.indexOf(keyword) !== -1;
    }).slice(0, 120);

    results.innerHTML = found.map(card).join('');
    if (empty) {
      empty.style.display = found.length ? 'none' : 'block';
    }
  }

  if (input) {
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        runSearch();
      }
    });
    input.addEventListener('input', runSearch);
  }

  if (button) {
    button.addEventListener('click', runSearch);
  }

  runSearch();
})();
