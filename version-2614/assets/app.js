(function () {
  var toggle = document.querySelector(".mobile-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var activeIndex = 0;
  var timer = null;

  function setHero(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle("active", itemIndex === activeIndex);
    });
    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle("active", itemIndex === activeIndex);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      setHero(activeIndex + 1);
    }, 4800);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      setHero(index);
      startHero();
    });
  });

  setHero(0);
  startHero();

  var searchInput = document.getElementById("movie-search");
  var yearFilter = document.getElementById("year-filter");
  var regionFilter = document.getElementById("region-filter");
  var genreFilter = document.getElementById("genre-filter");
  var clearButton = document.querySelector(".clear-search");
  var emptyState = document.getElementById("empty-state");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-target .movie-card"));

  function textValue(element) {
    return (element && element.value ? element.value : "").trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var keyword = textValue(searchInput);
    var year = textValue(yearFilter);
    var region = textValue(regionFilter);
    var genre = textValue(genreFilter);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();
      var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
      var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
      var cardGenre = (card.getAttribute("data-genre") || "").toLowerCase();
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }
      if (year && cardYear !== year) {
        matched = false;
      }
      if (region && cardRegion.indexOf(region) === -1) {
        matched = false;
      }
      if (genre && cardGenre.indexOf(genre) === -1 && haystack.indexOf(genre) === -1) {
        matched = false;
      }

      card.classList.toggle("hidden-by-filter", !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("show", visible === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query) {
      searchInput.value = query;
    }
    searchInput.addEventListener("input", applyFilters);
  }

  [yearFilter, regionFilter, genreFilter].forEach(function (select) {
    if (select) {
      select.addEventListener("change", applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (searchInput) {
        searchInput.value = "";
      }
      if (yearFilter) {
        yearFilter.value = "";
      }
      if (regionFilter) {
        regionFilter.value = "";
      }
      if (genreFilter) {
        genreFilter.value = "";
      }
      applyFilters();
    });
  }

  applyFilters();
})();
