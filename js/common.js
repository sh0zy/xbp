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

    /* ============================================================
       ACCENTURE-STYLE MOTION
       ============================================================ */

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Generic text splitter: wraps each character in <span class="char">,
    // groups lines by <br>, normalizes whitespace, preserves inline children
    function splitTextNodes(root) {
        if (!root || root.dataset.split === "done") return false;

        function appendChars(container, raw, trimLeading) {
            var text = raw.replace(/\s+/g, " ");
            if (trimLeading) text = text.replace(/^ /, "");
            for (var i = 0; i < text.length; i++) {
                var ch = text.charAt(i);
                if (ch === " ") {
                    container.appendChild(document.createTextNode(" "));
                } else {
                    var s = document.createElement("span");
                    s.className = "char";
                    s.textContent = ch;
                    container.appendChild(s);
                }
            }
        }

        var lineGroups = [[]];
        Array.prototype.forEach.call(root.childNodes, function (node) {
            if (node.nodeType === 1 && node.tagName === "BR") {
                lineGroups.push([]);
            } else {
                lineGroups[lineGroups.length - 1].push(node);
            }
        });

        root.innerHTML = "";
        lineGroups.forEach(function (group) {
            var lineEl = document.createElement("span");
            lineEl.className = "line";
            var first = true;
            group.forEach(function (node) {
                if (node.nodeType === 3) {
                    appendChars(lineEl, node.textContent, first);
                } else if (node.nodeType === 1) {
                    var wrapper = node.cloneNode(false);
                    appendChars(wrapper, node.textContent, false);
                    if (wrapper.childNodes.length) lineEl.appendChild(wrapper);
                }
                if (lineEl.childNodes.length) first = false;
            });
            if (lineEl.childNodes.length) root.appendChild(lineEl);
        });
        root.dataset.split = "done";
        return true;
    }

    // Hero text — split into characters, then animate immediately
    function initHeroReveal() {
        if (prefersReducedMotion()) return;
        var hero = document.querySelector(".hero");
        var title = document.querySelector(".hero-title");
        if (!hero || !title) return;

        if (!splitTextNodes(title)) return;

        var chars = title.querySelectorAll(".char");
        chars.forEach(function (el, idx) {
            el.style.transitionDelay = (0.035 * idx + 0.1) + "s";
        });

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                title.classList.add("is-revealed");
                hero.classList.add("is-revealed");
            });
        });
    }

    // Section titles — split, animate when scrolled into view
    function initSectionTitleReveal() {
        if (prefersReducedMotion()) return;
        var titles = document.querySelectorAll(".section-title, .feature-band-title, .cta-band-title");
        if (!titles.length) return;

        titles.forEach(function (t) {
            if (!splitTextNodes(t)) return;
            var chars = t.querySelectorAll(".char");
            chars.forEach(function (el, idx) {
                el.style.transitionDelay = (0.025 * idx) + "s";
            });
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });

        titles.forEach(function (t) { io.observe(t); });
    }

    // Animated stat counter
    function initCounters() {
        if (prefersReducedMotion()) return;
        var nums = document.querySelectorAll(".stat-num");
        if (!nums.length) return;

        function animateNumber(el, target) {
            var duration = 1400;
            var start = performance.now();
            function frame(now) {
                var t = Math.min(1, (now - start) / duration);
                var eased = 1 - Math.pow(1 - t, 3);
                var value = Math.floor(eased * target);
                var padded = target >= 10 && value < 10 ? "0" + value : String(value);
                if (target >= 100 && value < 100) padded = (value < 10 ? "00" : "0") + value;
                el.firstChild.nodeValue = padded;
                if (t < 1) requestAnimationFrame(frame);
                else el.firstChild.nodeValue = el.dataset.target;
            }
            requestAnimationFrame(frame);
        }

        nums.forEach(function (el) {
            // Parse leading numeric portion only; preserve trailing units (.unit span)
            var firstTextNode = null;
            for (var i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].nodeType === 3) { firstTextNode = el.childNodes[i]; break; }
            }
            if (!firstTextNode) return;
            var raw = firstTextNode.nodeValue.trim();
            var num = parseInt(raw, 10);
            if (isNaN(num)) return; // e.g., "∞"
            el.dataset.target = raw;
            firstTextNode.nodeValue = raw.replace(/\d/g, "0");
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.dataset.counted) return;
                el.dataset.counted = "1";
                var target = parseInt(el.dataset.target, 10);
                if (!isNaN(target)) animateNumber(el, target);
                io.unobserve(el);
            });
        }, { threshold: 0.4 });

        nums.forEach(function (el) { if (el.dataset.target) io.observe(el); });

        // Also flag the band as visible to trigger underline animation
        var band = document.querySelector(".stat-band");
        if (band) {
            var io2 = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        band.classList.add("is-visible");
                        io2.unobserve(band);
                    }
                });
            }, { threshold: 0.3 });
            io2.observe(band);
        }
    }

    // Magnetic hover on buttons
    function initMagnetic() {
        if (prefersReducedMotion()) return;
        if (window.matchMedia("(hover: none)").matches) return;
        var targets = document.querySelectorAll(".btn, .header-cta, .menu-toggle");
        targets.forEach(function (el) {
            var strength = 0.25;
            el.addEventListener("pointermove", function (e) {
                var r = el.getBoundingClientRect();
                var cx = r.left + r.width / 2;
                var cy = r.top + r.height / 2;
                var dx = (e.clientX - cx) * strength;
                var dy = (e.clientY - cy) * strength;
                el.style.transform = "translate(" + dx + "px, " + dy + "px)";
            });
            el.addEventListener("pointerleave", function () {
                el.style.transform = "";
            });
        });
    }

    // Custom cursor blob (desktop)
    function initCursor() {
        if (prefersReducedMotion()) return;
        if (window.matchMedia("(hover: none)").matches) return;
        if (window.innerWidth < 900) return;

        var blob = document.createElement("div");
        blob.className = "cursor-blob";
        document.body.appendChild(blob);

        var x = 0, y = 0, tx = 0, ty = 0;
        var ready = false;

        document.addEventListener("pointermove", function (e) {
            tx = e.clientX;
            ty = e.clientY;
            if (!ready) {
                x = tx; y = ty;
                blob.classList.add("is-ready");
                ready = true;
            }
        }, { passive: true });

        function loop() {
            x += (tx - x) * 0.22;
            y += (ty - y) * 0.22;
            blob.style.transform = "translate3d(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px, 0) translate(-50%, -50%)";
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        document.addEventListener("pointerover", function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            if (t.closest("a, button, .card, .filter-tab, .menu-toggle, .theme-toggle")) {
                blob.classList.add("is-hover");
                blob.classList.remove("is-text");
            } else if (t.closest("h1, h2, h3, p, li")) {
                blob.classList.add("is-text");
                blob.classList.remove("is-hover");
            } else {
                blob.classList.remove("is-hover", "is-text");
            }
        });
        document.addEventListener("pointerleave", function () { blob.style.opacity = "0"; });
        document.addEventListener("pointerenter", function () { blob.style.opacity = ""; });
    }

    // Parallax on media
    function initParallax() {
        if (prefersReducedMotion()) return;
        var items = [];
        document.querySelectorAll(".feature-band-media img, .card-visual img").forEach(function (img) {
            img.classList.add("parallax");
            items.push({ el: img, strength: 0.08 });
        });
        if (!items.length) return;

        var ticking = false;
        function update() {
            var vh = window.innerHeight;
            items.forEach(function (it) {
                var r = it.el.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                var progress = (r.top + r.height / 2 - vh / 2) / vh;
                var offset = -progress * 40 * it.strength * 4;
                it.el.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
            });
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    // Header hide on scroll-down, show on scroll-up
    function initHeaderHideOnScroll() {
        var header = document.querySelector(".header");
        if (!header) return;
        var lastY = window.scrollY;
        var ticking = false;
        function update() {
            var y = window.scrollY;
            if (y > lastY + 8 && y > 200) {
                header.classList.add("is-hidden");
            } else if (y < lastY - 4) {
                header.classList.remove("is-hidden");
            }
            lastY = y;
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
    }

    // Scroll progress bar
    function initScrollProgress() {
        var bar = document.createElement("div");
        bar.className = "scroll-progress";
        document.body.appendChild(bar);
        var ticking = false;
        function update() {
            var doc = document.documentElement;
            var max = doc.scrollHeight - doc.clientHeight;
            var p = max > 0 ? (window.scrollY / max) * 100 : 0;
            bar.style.width = p + "%";
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    document.addEventListener("DOMContentLoaded", function () {
        initDarkMode();
        initHeroReveal();
        initSectionTitleReveal();
        initReveal();
        initHeaderScroll();
        initHeaderHideOnScroll();
        initPageTop();
        initMegaMenu();
        initPageTransition();
        initLazyLoad();
        initYear();
        initCounters();
        initMagnetic();
        initCursor();
        initParallax();
        initScrollProgress();
    });
})();
