document.addEventListener('DOMContentLoaded', function () {
    var sections = document.querySelectorAll('.hiw-category');
    var stepperDots = document.querySelectorAll('.hiw-stepper-dot');
    var stepperLines = document.querySelectorAll('.hiw-stepper-line');
    var subcategories = document.querySelectorAll('.hiw-subcategory');
    var stepper = document.querySelector('.hiw-stepper');

    // Mobile TOC elements
    var mobileTocCard = document.querySelector('.hiw-mobile-toc-card');
    var mobileTocHeader = document.querySelector('.hiw-mobile-toc-header');
    var mobileTocLinks = document.querySelectorAll('.hiw-mobile-toc-link');
    var mobileTocActive = document.querySelector('.hiw-mobile-toc-active');
    var mobileTocOverlay = document.querySelector('.hiw-mobile-toc-overlay');

    // --- Expand / Collapse subcategories ---
    subcategories.forEach(function (sub) {
        var header = sub.querySelector('.hiw-sub-header');
        if (!header) return;
        header.addEventListener('click', function () {
            var wasOpen = sub.classList.contains('open');
            sub.classList.toggle('open');
            if (!wasOpen) {
                setTimeout(function () {
                    sub.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });

    // --- Mobile TOC toggle ---
    function openMobileToc() {
        if (!mobileTocCard) return;
        mobileTocCard.classList.add('open');
        if (mobileTocOverlay) {
            mobileTocOverlay.classList.add('visible');
        }
    }

    function closeMobileToc() {
        if (!mobileTocCard) return;
        mobileTocCard.classList.remove('open');
        if (mobileTocOverlay) {
            mobileTocOverlay.classList.remove('visible');
        }
    }

    if (mobileTocHeader && mobileTocCard) {
        mobileTocHeader.addEventListener('click', function () {
            if (mobileTocCard.classList.contains('open')) {
                closeMobileToc();
            } else {
                openMobileToc();
            }
        });
    }

    if (mobileTocOverlay) {
        mobileTocOverlay.addEventListener('click', closeMobileToc);
    }

    mobileTocLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href.charAt(0) !== '#') return;
            e.preventDefault();
            closeMobileToc();
            var target = document.getElementById(href.substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', href);
            }
        });
    });

    // --- Scroll Spy ---
    var currentActive = -1;

    function updateScrollSpy() {
        var found = -1;

        for (var i = sections.length - 1; i >= 0; i--) {
            var rect = sections[i].getBoundingClientRect();
            if (rect.top <= 160) {
                found = i;
                break;
            }
        }

        if (found === currentActive) return;
        currentActive = found;

        // Update desktop stepper
        stepperDots.forEach(function (dot, idx) {
            dot.classList.toggle('active', idx === found);
        });

        stepperLines.forEach(function (line, idx) {
            line.classList.toggle('active', idx < found);
        });

        if (found >= 0 && stepper) {
            var activeDot = stepperDots[found];
            if (activeDot) {
                var dotRect = activeDot.getBoundingClientRect();
                var stepperRect = stepper.getBoundingClientRect();
                if (dotRect.left < stepperRect.left || dotRect.right > stepperRect.right) {
                    activeDot.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }
        }

        // Update mobile TOC
        mobileTocLinks.forEach(function (link, idx) {
            link.classList.toggle('active', idx === found);
        });

        if (found >= 0 && mobileTocActive) {
            var activeLink = mobileTocLinks[found];
            if (activeLink) {
                mobileTocActive.textContent = activeLink.getAttribute('data-label') || '';
            }
        }
    }

    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            requestAnimationFrame(function () {
                updateScrollSpy();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    updateScrollSpy();

    // --- Smooth Scroll for stepper links ---
    stepperDots.forEach(function (dot) {
        dot.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href.charAt(0) !== '#') return;
            e.preventDefault();
            var target = document.getElementById(href.substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', href);
            }
        });
    });

    // --- Hash Navigation on Page Load ---
    function handleHash() {
        var hash = window.location.hash;
        if (!hash) return;

        var target = document.querySelector(hash);
        if (!target) return;

        var parentSub = target.closest('.hiw-subcategory');
        if (parentSub && !parentSub.classList.contains('open')) {
            parentSub.classList.add('open');
        }

        setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    handleHash();
    window.addEventListener('hashchange', handleHash);
});
