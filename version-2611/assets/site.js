(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        var isOpen = mobilePanel.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    var backTop = document.querySelector(".back-top");

    if (backTop) {
      window.addEventListener("scroll", function () {
        backTop.classList.toggle("visible", window.scrollY > 480);
      });

      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var slider = document.querySelector(".hero-slider");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var index = 0;

      function showSlide(nextIndex) {
        if (!slides.length) {
          return;
        }

        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          showSlide(dotIndex);
        });
      });

      showSlide(0);
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    var filterPanel = document.querySelector(".filter-panel");

    if (filterPanel) {
      var keywordInput = filterPanel.querySelector("[data-filter-keyword]");
      var yearSelect = filterPanel.querySelector("[data-filter-year]");
      var genreSelect = filterPanel.querySelector("[data-filter-genre]");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      var button = filterPanel.querySelector(".filter-btn");

      function applyFilters() {
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var genre = genreSelect ? genreSelect.value : "";

        cards.forEach(function (card) {
          var text = [
            card.dataset.title || "",
            card.dataset.genre || "",
            card.dataset.region || "",
            card.textContent || ""
          ].join(" ").toLowerCase();
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedYear = !year || (card.dataset.year || "").indexOf(year) !== -1;
          var matchedGenre = !genre || (card.dataset.genre || "").indexOf(genre) !== -1;
          card.hidden = !(matchedKeyword && matchedYear && matchedGenre);
        });
      }

      [keywordInput, yearSelect, genreSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });

      if (button) {
        button.addEventListener("click", applyFilters);
      }
    }
  });
})();
