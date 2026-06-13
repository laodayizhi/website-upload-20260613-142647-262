(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function setupHero() {
        var slides = selectAll('.hero-slide');
        var dots = selectAll('.hero-dot');
        if (!slides.length) {
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
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupFilters() {
        var input = document.querySelector('.page-filter-input');
        var select = document.querySelector('.page-filter-select');
        var cards = selectAll('.searchable-list .movie-card');
        if (!cards.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input && query) {
            input.value = query;
        }
        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }
        function filter() {
            var keyword = normalize(input ? input.value : '');
            var channel = normalize(select ? select.value : '');
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.textContent
                ].join(' '));
                var list = card.closest('.searchable-list');
                var cardChannel = normalize(card.getAttribute('data-channel') || (list ? list.getAttribute('data-channel') : ''));
                var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                var channelMatch = !channel || cardChannel === channel || haystack.indexOf(channel) !== -1;
                card.classList.toggle('search-hidden', !(keywordMatch && channelMatch));
            });
        }
        if (input) {
            input.addEventListener('input', filter);
        }
        if (select) {
            select.addEventListener('change', filter);
        }
        filter();
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
