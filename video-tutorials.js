document.addEventListener('DOMContentLoaded', function () {
    var STORAGE_KEY = 'aequifin_vt_learning';

    /* Client showcase: progress resets to 0% on every reload. Remove this block for production. */
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    var learningSection = document.getElementById('learning-videos');
    var learningCards = learningSection
        ? learningSection.querySelectorAll('.vt-card[data-video-id]')
        : [];
    var totalLearning = learningCards.length;

    var progressPct = document.querySelector('.vt-progress-pct');
    var progressDetail = document.querySelector('.vt-progress-detail');
    var progressBarFill = document.querySelector('.vt-progress-bar-fill');
    var progressRingFill = document.querySelector('.vt-progress-ring-fill');
    var progressBadge = document.querySelector('.vt-progress-badge');
    var progressCta = document.querySelector('.vt-progress-cta');

    var allCards = document.querySelectorAll('.vt-card[data-video-id]');

    var currentExpanded = null;
    var wasAllLearningComplete = false;

    var mobileQuery = window.matchMedia('(max-width: 767px)');

    function isMobile() {
        return mobileQuery.matches;
    }

    function getWatched() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveWatched(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    function getLearningProgressKey(card) {
        return card.dataset.learningKey || card.dataset.videoId;
    }

    function markLearningWatched(card) {
        if (!isLearningCard(card)) return;
        var key = getLearningProgressKey(card);
        var watched = getWatched();
        if (watched.indexOf(key) === -1) {
            watched.push(key);
            saveWatched(watched);
        }
        updateProgress();
    }

    function isLearningCard(card) {
        if (!learningSection) return false;
        return learningSection.contains(card);
    }

    function isModalSection(card) {
        return card.closest('.vt-section--cases') ||
               card.closest('.vt-section--about') ||
               card.closest('.vt-section--testimonials');
    }

    function getVideoSrc(card, autoplay) {
        var customSrc = card.dataset.videoSrc || '';
        if (customSrc) {
            var hasQuery = customSrc.indexOf('?') !== -1;
            return customSrc + (hasQuery ? '&' : '?') +
                'autoplay=' + (autoplay ? '1' : '0') +
                '&title=0&byline=0&portrait=0';
        }

        var videoId = card.dataset.videoId;
        var videoHash = card.dataset.videoH || '';
        var query = videoHash
            ? '?h=' + videoHash + '&autoplay=' + (autoplay ? '1' : '0') + '&title=0&byline=0&portrait=0&badge=0&autopause=0'
            : '?autoplay=' + (autoplay ? '1' : '0') + '&title=0&byline=0&portrait=0&badge=0&autopause=0';
        return 'https://player.vimeo.com/video/' + videoId + query;
    }

    function updateProgress() {
        var watched = getWatched();
        var count = 0;
        learningCards.forEach(function (card) {
            var key = getLearningProgressKey(card);
            var isWatched = watched.indexOf(key) !== -1;
            card.classList.toggle('watched', isWatched);
            if (isWatched) count++;
        });

        var pct = totalLearning > 0 ? Math.round((count / totalLearning) * 100) : 0;

        if (progressPct) progressPct.textContent = pct + '%';
        if (progressDetail) {
            var tpl = progressDetail.dataset.template || '{count} of {total} videos watched';
            progressDetail.textContent = tpl.replace('{count}', count).replace('{total}', totalLearning);
        }
        if (progressBarFill) progressBarFill.style.width = pct + '%';

        if (progressRingFill) {
            var circ = 2 * Math.PI * 34;
            progressRingFill.style.strokeDasharray = circ;
            progressRingFill.style.strokeDashoffset = circ - (pct / 100) * circ;
        }

        var allDone = count >= totalLearning && totalLearning > 0;

        if (progressBadge) {
            progressBadge.classList.toggle('unlocked', allDone);
        }

        if (allDone && !wasAllLearningComplete) {
            fireConfetti();
        }
        wasAllLearningComplete = allDone;
    }

    function embedVideo(card) {
        if (card.classList.contains('playing')) return;
        var thumb = card.querySelector('.vt-thumb');
        card.classList.add('playing');

        var iframe = document.createElement('iframe');
        iframe.src = getVideoSrc(card, true);
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        thumb.appendChild(iframe);

        if (isLearningCard(card)) {
            markLearningWatched(card);
        }
    }

    // --- In-place expand ---

    function expandCard(card) {
        if (card.classList.contains('expanded')) return;

        if (currentExpanded) {
            collapseCard(currentExpanded);
        }

        var title = card.querySelector('.vt-card-title');
        var panelContent = card.querySelector('.vt-panel-content');

        var inner = card.querySelector('.vt-expanded-inner');
        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'vt-expanded-inner';

            var videoEl = document.createElement('div');
            videoEl.className = 'vt-expanded-video';
            inner.appendChild(videoEl);

            var panel = document.createElement('div');
            panel.className = 'vt-expanded-panel';

            var header = document.createElement('div');
            header.className = 'vt-expanded-header';
            var h3 = document.createElement('h3');
            h3.textContent = title ? title.textContent : '';
            header.appendChild(h3);

            var closeBtn = document.createElement('button');
            closeBtn.className = 'vt-expanded-close';
            closeBtn.type = 'button';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                collapseCard(card);
            });
            header.appendChild(closeBtn);
            panel.appendChild(header);

            var info = document.createElement('div');
            info.className = 'vt-expanded-info';
            if (panelContent) {
                info.innerHTML = panelContent.innerHTML;
            }
            panel.appendChild(info);

            inner.appendChild(panel);
            card.appendChild(inner);
        }

        var videoContainer = inner.querySelector('.vt-expanded-video');
        videoContainer.innerHTML = '<iframe src="' + getVideoSrc(card, true) +
            '" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

        card.classList.add('expanded');
        currentExpanded = card;

        setTimeout(function () {
            var panelEl = inner.querySelector('.vt-expanded-panel');
            if (videoContainer && panelEl) {
                panelEl.style.maxHeight = videoContainer.offsetHeight + 'px';
            }
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }

    function collapseCard(card) {
        if (!card || !card.classList.contains('expanded')) return;

        card.classList.remove('expanded');

        var videoContainer = card.querySelector('.vt-expanded-video');
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }

        if (currentExpanded === card) {
            currentExpanded = null;
        }
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && currentExpanded) {
            collapseCard(currentExpanded);
        }
    });

    // --- Card click handler ---
    allCards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (isMobile()) {
                if (card.closest('.vt-section--testimonials')) {
                    expandCard(card);
                } else {
                    embedVideo(card);
                }
            } else if (isModalSection(card)) {
                expandCard(card);
            } else {
                embedVideo(card);
            }
        });
    });

    if (isMobile()) {
        allCards.forEach(function (card) {
            card.classList.add('revealed');
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        allCards.forEach(function (card) {
            revealObserver.observe(card);
        });

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.vt-section').forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            sectionObserver.observe(el);
        });

        document.querySelectorAll('.vt-hero, .content-section.no-animate').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // Confetti
    function fireConfetti() {
        var canvas = document.getElementById('vt-confetti');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var particles = [];
        var colors = ['#66d1ff', '#008ece', '#005781', '#ffd700', '#ff6b6b', '#51cf66'];
        for (var i = 0; i < 120; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 14 - 4,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                life: 1
            });
        }

        var startTime = Date.now();
        function animate() {
            var elapsed = Date.now() - startTime;
            if (elapsed > 2500) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35;
                p.vx *= 0.99;
                p.rotation += p.rotationSpeed;
                p.life -= 0.008;
                if (p.life <= 0) return;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    updateProgress();
});
