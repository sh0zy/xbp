/* ============================================================
   XBP Common JavaScript
   スクロールアニメ / ヘッダー変化 / ページトップボタン / カード演出
   ダークモード / ページ遷移 / Lazy Loading
   ============================================================ */

(function () {
    "use strict";

    /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
    function initReveal() {
        var els = document.querySelectorAll(".reveal");
        if (!els.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        els.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------- Header Scroll State ---------- */
    function initHeaderScroll() {
        var header = document.querySelector(".header");
        if (!header) return;

        var threshold = 60;
        var ticking = false;

        function update() {
            if (window.scrollY > threshold) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
            ticking = false;
        }

        window.addEventListener("scroll", function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    /* ---------- Page Top Button ---------- */
    function initPageTop() {
        var btn = document.querySelector(".page-top-btn");
        if (!btn) return;

        var showThreshold = 400;
        var ticking = false;

        function update() {
            if (window.scrollY > showThreshold) {
                btn.classList.add("is-visible");
            } else {
                btn.classList.remove("is-visible");
            }
            ticking = false;
        }

        window.addEventListener("scroll", function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        update();
    }

    /* ---------- Card Mouse Glow Effect ---------- */
    function initCardGlow() {
        var cards = document.querySelectorAll(".card");
        cards.forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty("--mouse-x", x + "%");
                card.style.setProperty("--mouse-y", y + "%");
            });
        });
    }

    /* ---------- Dark Mode Toggle ---------- */
    function initDarkMode() {
        var toggle = document.querySelector(".theme-toggle");
        var root = document.documentElement;

        // Restore saved preference or respect system preference
        var saved = localStorage.getItem("xbp-theme");
        if (saved) {
            root.setAttribute("data-theme", saved);
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            root.setAttribute("data-theme", "dark");
        }

        if (!toggle) return;

        toggle.addEventListener("click", function () {
            var current = root.getAttribute("data-theme");
            var next = current === "dark" ? "light" : "dark";
            if (next === "light") {
                root.removeAttribute("data-theme");
            } else {
                root.setAttribute("data-theme", "dark");
            }
            localStorage.setItem("xbp-theme", next);
        });
    }

    /* ---------- Page Transition ---------- */
    function initPageTransition() {
        var overlay = document.querySelector(".page-transition");
        if (!overlay) return;

        // Intercept internal links for fade-out
        var links = document.querySelectorAll('a[href]');
        links.forEach(function (link) {
            // Skip external, target=_blank, hash-only, javascript:, and non-html links
            if (link.target === "_blank" ||
                link.getAttribute("href").charAt(0) === "#" ||
                link.getAttribute("href").indexOf("javascript:") === 0 ||
                link.getAttribute("href").indexOf("mailto:") === 0 ||
                link.getAttribute("href").match(/\.(apk|py|zip|pdf|png|jpg|gif)$/i)) {
                return;
            }

            link.addEventListener("click", function (e) {
                var href = link.getAttribute("href");
                e.preventDefault();
                overlay.classList.add("is-active");
                setTimeout(function () {
                    window.location.href = href;
                }, 300);
            });
        });
    }

    /* ---------- Lazy Loading Images ---------- */
    function initLazyLoad() {
        // Native lazy loading is set via HTML attribute loading="lazy"
        // This adds IntersectionObserver fallback for older browsers
        if ("loading" in HTMLImageElement.prototype) return;

        var images = document.querySelectorAll('img[loading="lazy"]');
        if (!images.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: "200px" });

        images.forEach(function (img) {
            observer.observe(img);
        });
    }

    /* ---------- Current Year ---------- */
    function initYear() {
        var els = document.querySelectorAll("[data-current-year]");
        var year = String(new Date().getFullYear());
        els.forEach(function (el) {
            el.textContent = year;
        });
    }

    /* ---------- Init ---------- */
    document.addEventListener("DOMContentLoaded", function () {
        initDarkMode();
        initReveal();
        initHeaderScroll();
        initPageTop();
        initCardGlow();
        initPageTransition();
        initLazyLoad();
        initYear();
    });
})();
