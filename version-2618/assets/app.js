(function() {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var genreSelect = document.querySelector('[data-filter-genre]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var empty = document.querySelector('.empty-state');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }
    var keyword = normalize(filterInput && filterInput.value);
    var genre = normalize(genreSelect && genreSelect.value);
    var year = normalize(yearSelect && yearSelect.value);
    var visible = 0;

    cards.forEach(function(card) {
      var source = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year')
      ].join(' '));
      var ok = true;
      if (keyword && source.indexOf(keyword) === -1) {
        ok = false;
      }
      if (genre && normalize(card.getAttribute('data-genre')).indexOf(genre) === -1) {
        ok = false;
      }
      if (year && normalize(card.getAttribute('data-year')) !== year) {
        ok = false;
      }
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  [filterInput, genreSelect, yearSelect].forEach(function(control) {
    if (control) {
      control.addEventListener('input', applyFilter);
      control.addEventListener('change', applyFilter);
    }
  });

  var quickSearch = document.querySelector('[data-site-search]');
  var quickButton = document.querySelector('[data-site-search-button]');

  function submitQuickSearch() {
    var value = quickSearch ? quickSearch.value.trim() : '';
    if (value) {
      window.location.href = './search.html?q=' + encodeURIComponent(value);
    }
  }

  if (quickSearch) {
    quickSearch.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        submitQuickSearch();
      }
    });
  }

  if (quickButton) {
    quickButton.addEventListener('click', submitQuickSearch);
  }
})();
