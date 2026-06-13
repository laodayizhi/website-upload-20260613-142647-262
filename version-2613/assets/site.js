(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterYear = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function matchesYear(card, yearValue) {
        if (!yearValue) {
            return true;
        }

        var year = Number(card.getAttribute('data-year') || 0);

        if (yearValue === 'older') {
            return year > 0 && year < 2020;
        }

        return String(year) === yearValue;
    }

    function applyFilters() {
        var keyword = normalize(filterInput ? filterInput.value : '');
        var yearValue = filterYear ? filterYear.value : '';

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.textContent
            ].join(' '));

            var visible = (!keyword || haystack.indexOf(keyword) !== -1) && matchesYear(card, yearValue);
            card.classList.toggle('is-hidden', !visible);
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilters);
    }

    if (filterYear) {
        filterYear.addEventListener('change', applyFilters);
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && filterInput) {
        filterInput.value = initialQuery;
        applyFilters();
    }
})();
