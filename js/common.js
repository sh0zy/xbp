/* ============================================================
   XBP Common JavaScript — Accenture-inspired
   メガメニュー / スクロールリビール / ヘッダー / トップに戻る
   ダークモード / ページ遷移 / Lazy Loading
   ============================================================ */

(function () {
    "use strict";

    function initReveal() {
        var els = document.querySelectorAll(".reveal");
        if (!els.length) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        els.forEach(function (el) { observer.observe(el); });
    }

    function initHeaderScroll() {
        var header = document.querySelector(".header");
        if (!header) return;
        var threshold = 24;
        var ticking = false;
        function update() {
            header.classList.toggle("is-scrolled", window.scrollY > threshold);
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    function initPageTop() {
        var btn = document.querySelector(".page-top-btn");
        if (!btn) return;
        var showThreshold = 400;
        var ticking = false;
        function update() {
            btn.classList.toggle("is-visible", window.scrollY > showThreshold);
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        update();
    }

    function initMegaMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mega-menu");
        var backdrop = document.querySelector(".mega-menu-backdrop");
        if (!toggle || !menu) return;

        function setOpen(open) {
            toggle.classList.toggle("is-open", open);
            menu.classList.toggle("is-open", open);
            if (backdrop) backdrop.classList.toggle("is-open", open);
            document.body.classList.toggle("menu-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        }

        toggle.addEventListener("click", function () {
            setOpen(!menu.classList.contains("is-open"));
        });

        if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });

        menu.addEventListener("click", function (e) {
            var link = e.target.closest("a");
            if (link) setOpen(false);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                setOpen(false);
            }
        });
    }

    function initDarkMode() {
        var toggle = document.querySelector(".theme-toggle");
        var root = document.documentElement;
        var saved = localStorage.getItem("xbp-theme");
        if (saved === "light") {
            root.removeAttribute("data-theme");
        } else {
            root.setAttribute("data-theme", "dark");
        }
        if (!toggle) return;
        toggle.addEventListener("click", function () {
            var current = root.getAttribute("data-theme");
            var next = current === "dark" ? "light" : "dark";
            if (next === "light") root.removeAttribute("data-theme");
            else root.setAttribute("data-theme", "dark");
            localStorage.setItem("xbp-theme", next);
        });
    }

    function initPageTransition() {
        var overlay = document.querySelector(".page-transition");
        if (!overlay) return;
        var links = document.querySelectorAll('a[href]');
        links.forEach(function (link) {
            var href = link.getAttribute("href");
            if (link.target === "_blank" ||
                !href ||
                href.charAt(0) === "#" ||
                href.indexOf("javascript:") === 0 ||
                href.indexOf("mailto:") === 0 ||
                href.indexOf("tel:") === 0 ||
                href.indexOf("http") === 0 ||
                href.match(/\.(apk|py|zip|pdf|png|jpg|jpeg|gif|svg|webp|mp4)$/i)) {
                return;
            }
            link.addEventListener("click", function (e) {
                e.preventDefault();
                overlay.classList.add("is-active");
                setTimeout(function () { window.location.href = href; }, 280);
            });
        });
    }

    function initLazyLoad() {
        if ("loading" in HTMLImageElement.prototype) return;
        var images = document.querySelectorAll('img[loading="lazy"]');
        if (!images.length) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: "200px" });
        images.forEach(function (img) { observer.observe(img); });
    }

    function initYear() {
        var els = document.querySelectorAll("[data-current-year]");
        var year = String(new Date().getFullYear());
        els.forEach(function (el) { el.textContent = year; });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initDarkMode();
        initReveal();
        initHeaderScroll();
        initPageTop();
        initMegaMenu();
        initPageTransition();
        initLazyLoad();
        initYear();
    });
})();
