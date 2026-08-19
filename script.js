(function () {
    "use strict";

    var MOBILE_QUERY = "(max-width: 900px)";

    /* 1. mobile view  */
    function initNav() {
        var nav = document.querySelector(".nav");
        var toggle = document.getElementById("navToggle");
        var panel = document.getElementById("primaryNav");

        if (!nav || !toggle || !panel) return;

        function setOpen(open) {
            nav.classList.toggle("nav--open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        }

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            setOpen(!nav.classList.contains("nav--open"));
        });

        
        panel.addEventListener("click", function (e) {
            if (e.target.closest("a")) setOpen(false);
        });

        document.addEventListener("click", function (e) {
            if (!nav.contains(e.target)) setOpen(false);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setOpen(false);
        });

        var mq = window.matchMedia(MOBILE_QUERY);
        var onChange = function () {
            if (!mq.matches) setOpen(false);
        };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange);
    }

    /* 2. courses tab */
    function initCourseTabs() {
        var tabs = Array.prototype.slice.call(
            document.querySelectorAll(".tabs .tab[data-filter]")
        );
        var cards = Array.prototype.slice.call(
            document.querySelectorAll(".course-grid .course-card")
        );

        if (!tabs.length || !cards.length) return;

        var ICON_LIGHT = "assets/icon-info-light.svg";
        var ICON_DARK = "assets/icon-info-dark.svg";

        function activate(tab) {
            tabs.forEach(function (t) {
                var isActive = t === tab;

                t.classList.toggle("tab--active", isActive);
                t.setAttribute("aria-selected", isActive ? "true" : "false");

                var info = t.querySelector(".tab__info");
                if (info) info.setAttribute("src", isActive ? ICON_LIGHT : ICON_DARK);
            });

            var filter = tab.getAttribute("data-filter");
            cards.forEach(function (card) {
                var match = filter === "all" || card.getAttribute("data-level") === filter;
                card.hidden = !match;
            });
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                activate(tab);
            });
        });

        activate(document.querySelector(".tabs .tab--active") || tabs[0]);
    }

    /* 3. start learning steps section */
    function initSteps() {
        var steps = Array.prototype.slice.call(document.querySelectorAll(".steps__list .step"));
        if (!steps.length) return;

        function activate(step) {
            steps.forEach(function (s) {
                var isActive = s === step;
                s.classList.toggle("step--active", isActive);
                s.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
        }

        steps.forEach(function (step) {
            step.addEventListener("click", function () {
                activate(step);
            });

            step.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    activate(step);
                }
            });
        });
    }

    /* 4. faculty section */
    function initFacultySlider() {
        var section = document.querySelector(".faculty");
        if (!section) return;

        var grid = section.querySelector(".faculty__grid");
        var prev = section.querySelector(".slider-nav__btn--prev");
        var next = section.querySelector(".slider-nav__btn--next");
        if (!grid || !prev || !next) return;

        var cards = Array.prototype.slice.call(grid.children);
        var start = 0;

        function perView() {
            var w = window.innerWidth;
            if (w <= 620) return 1;
            if (w <= 1100) return 2;
            return 4;
        }

        function render() {
            var n = perView();
            var max = Math.max(0, cards.length - n);

            if (start > max) start = max;
            if (start < 0) start = 0;

            cards.forEach(function (card, i) {
                card.hidden = i < start || i >= start + n;
            });

            prev.disabled = start === 0;
            next.disabled = start >= max;
        }

        prev.addEventListener("click", function () {
            start -= 1;
            render();
        });

        next.addEventListener("click", function () {
            start += 1;
            render();
        });

        window.addEventListener("resize", render);
        render();
    }

    /* 5. audience section */
    function initAudienceCards() {
        var cards = Array.prototype.slice.call(
            document.querySelectorAll(".audience__grid .audience-card")
        );
        if (!cards.length) return;

        var TICK_ON = "Design Assets Folder/Subscription/Tick Icon active.svg";
        var TICK_OFF = "Design Assets Folder/Subscription/Tick Icon inactive.svg";

        function activate(card) {
            cards.forEach(function (c) {
                var isActive = c === card;

                c.classList.toggle("audience-card--accent", isActive);
                c.setAttribute("aria-pressed", isActive ? "true" : "false");

                c.querySelectorAll(".checklist img").forEach(function (tick) {
                    tick.setAttribute("src", isActive ? TICK_ON : TICK_OFF);
                });

                var btn = c.querySelector(".btn");
                if (btn) {
                    btn.classList.toggle("btn--primary", isActive);
                    btn.classList.toggle("btn--dark", !isActive);
                }
            });
        }

        cards.forEach(function (card) {
            card.addEventListener("click", function (e) {
                if (e.target.closest("a")) return;
                activate(card);
            });

            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    activate(card);
                }
            });
        });
    }

    /* 6. init all */ 
    function init() {
        initNav();
        initCourseTabs();
        initSteps();
        initFacultySlider();
        initAudienceCards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();