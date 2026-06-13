(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        var menuButton = document.querySelector(".menu-toggle");
        var mobileNav = document.querySelector(".mobile-nav");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function() {
                var expanded = menuButton.getAttribute("aria-expanded") === "true";
                menuButton.setAttribute("aria-expanded", String(!expanded));
                mobileNav.classList.toggle("is-open", !expanded);
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startSlides() {
            if (slides.length < 2) {
                return;
            }
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(index);
                startSlides();
            });
        });

        showSlide(0);
        startSlides();

        Array.prototype.slice.call(document.querySelectorAll(".filter-panel")).forEach(function(panel) {
            var wrap = panel.parentElement;
            var input = panel.querySelector(".filter-input");
            var type = panel.querySelector(".filter-type");
            var year = panel.querySelector(".filter-year");
            var cards = Array.prototype.slice.call(wrap.querySelectorAll(".movie-card"));

            function applyFilter() {
                var query = (input && input.value ? input.value : "").trim().toLowerCase();
                var typeValue = type && type.value ? type.value : "";
                var yearValue = year && year.value ? year.value : "";

                cards.forEach(function(card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" ").toLowerCase();
                    var cardType = card.getAttribute("data-type") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var okQuery = !query || text.indexOf(query) !== -1;
                    var okType = !typeValue || cardType.indexOf(typeValue) !== -1;
                    var okYear = !yearValue || cardYear === yearValue;
                    card.classList.toggle("is-filter-hidden", !(okQuery && okType && okYear));
                });
            }

            [input, type, year].forEach(function(el) {
                if (el) {
                    el.addEventListener("input", applyFilter);
                    el.addEventListener("change", applyFilter);
                }
            });
        });
    });
})();
