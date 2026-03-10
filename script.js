// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all tiles and sections (except ones explicitly marked no-animate)
    const animatedElements = document.querySelectorAll('.tile, .content-section:not(.no-animate)');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize - show first elements immediately (hero + "Who is AEQUIFIN?")
    const firstElements = document.querySelectorAll('.hero-section, #who-is-aequifin');
    firstElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Ecosystem Visualization Interactive Highlighting
    const ecosystemItems = document.querySelectorAll('.ecosystem-item');
    const ecosystemNodes = document.querySelectorAll('.ecosystem-node');
    const connectionLines = document.querySelectorAll('.connection-line');
    const nodeSubtexts = document.querySelectorAll('.node-subtext');
    
    function resetVisualization() {
        // Reset all nodes
        ecosystemNodes.forEach(node => {
            node.classList.remove('active', 'inactive');
        });
        
        // Reset all connection lines
        connectionLines.forEach(line => {
            line.classList.remove('active', 'inactive');
            if (line.tagName === 'path' || line.tagName === 'line') {
                line.setAttribute('marker-end', 'url(#arrowhead)');
            }
        });
        
        // Reset all text items
        ecosystemItems.forEach(item => {
            item.classList.remove('active');
        });

        // Reset node subtexts
        nodeSubtexts.forEach(text => {
            text.classList.remove('active');
        });
    }
    
    function highlightElement(target) {
        resetVisualization();
        
        // Highlight the target node
        const targetNode = document.getElementById(`node-${target}`);
        if (targetNode) {
            targetNode.classList.add('active');
            
            // Make other nodes inactive
            ecosystemNodes.forEach(node => {
                if (node.id !== `node-${target}`) {
                    node.classList.add('inactive');
                }
            });
        }
        
        // Highlight only the outgoing arrow for each target (Direction: Lawyers → Sponsors → Litigants → Lawyers)
        const relatedLines = [];
        if (target === 'lawyers') {
            relatedLines.push('line-lawyers-sponsors'); // Outgoing: Lawyers → Sponsors
        } else if (target === 'sponsors') {
            relatedLines.push('line-sponsors-litigants'); // Outgoing: Sponsors → Litigants
        } else if (target === 'litigants') {
            relatedLines.push('line-litigants-lawyers'); // Outgoing: Litigants → Lawyers
        }
        
        connectionLines.forEach(line => {
            if (relatedLines.includes(line.id)) {
                line.classList.add('active');
                // Update marker for both line and path elements
                if (line.tagName === 'path' || line.tagName === 'line') {
                    line.setAttribute('marker-end', 'url(#arrowhead-active)');
                }
            } else {
                line.classList.add('inactive');
                if (line.tagName === 'path' || line.tagName === 'line') {
                    line.setAttribute('marker-end', 'url(#arrowhead)');
                }
            }
        });
        
        // Highlight the text item
        const targetItem = document.querySelector(`.ecosystem-item[data-target="${target}"]`);
        if (targetItem) {
            targetItem.classList.add('active');
        }

        // Highlight the matching node subtext
        nodeSubtexts.forEach(text => {
            if (text.getAttribute('data-entity') === target) {
                text.classList.add('active');
            }
        });
    }
    
    // Add hover/click events to text items
    ecosystemItems.forEach(item => {
        const target = item.getAttribute('data-target');
        
        item.addEventListener('mouseenter', () => {
            highlightElement(target);
        });

        item.addEventListener('mouseleave', () => {
            resetVisualization();
        });
        
        item.addEventListener('click', () => {
            highlightElement(target);
        });
    });
    
    // Add hover events to visual nodes
    ecosystemNodes.forEach(node => {
        const nodeId = node.id.replace('node-', '');
        
        node.addEventListener('mouseenter', () => {
            highlightElement(nodeId);
        });
        
        node.addEventListener('mouseleave', () => {
            resetVisualization();
        });
    });
    
    // (Highlight resets are now handled on item/node mouseleave)

    // Video expand on click
    const videoWrapper = document.querySelector('.who-video-wrapper[data-video-id]');
    if (videoWrapper) {
        const videoLink = videoWrapper.querySelector('.who-video-link');
        const layout = videoWrapper.closest('.who-layout');
        const videoId = videoWrapper.dataset.videoId;

        videoLink.addEventListener('click', () => {
            if (layout.classList.contains('video-expanded')) return;

            const isMobile = window.innerWidth < 768;

            if (!isMobile) {
                layout.classList.add('video-expanded');
            }

            const iframe = document.createElement('iframe');
            iframe.src = 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&title=0&byline=0&portrait=0';
            iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');

            videoLink.style.display = 'none';
            videoWrapper.appendChild(iframe);

            if (!isMobile) {
                videoWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Team member detail panel
    const teamGrid = document.querySelector('.team-grid-equal');
    const detailPanel = document.querySelector('.team-member-detail');
    if (teamGrid && detailPanel) {
        const cards = teamGrid.querySelectorAll('.team-member-card');
        const closeBtn = detailPanel.querySelector('.detail-close');

        function getColCount() {
            const style = getComputedStyle(teamGrid);
            const cols = style.gridTemplateColumns.split(' ').length;
            return cols;
        }

        function closePanel() {
            detailPanel.classList.remove('open');
            detailPanel.style.display = 'none';
            cards.forEach(c => c.classList.remove('selected'));
            // On mobile, move detail panel back to end so nth-child hiding works correctly
            if (window.innerWidth < 768) {
                teamGrid.appendChild(detailPanel);
            }
        }

        function openPanel(card) {
            const wasOpen = detailPanel.classList.contains('open');
            const wasSame = card.classList.contains('selected');

            cards.forEach(c => c.classList.remove('selected'));

            if (wasOpen && wasSame) {
                closePanel();
                return;
            }

            card.classList.add('selected');

            const name = card.querySelector('h4').textContent;
            const role = card.querySelector('.member-role').textContent;
            const imgSrc = card.querySelector('.member-avatar img').src;
            const imgAlt = card.querySelector('.member-avatar img').alt;

            detailPanel.querySelector('.detail-name').textContent = name;
            detailPanel.querySelector('.detail-role').textContent = role;
            detailPanel.querySelector('.detail-avatar img').src = imgSrc;
            detailPanel.querySelector('.detail-avatar img').alt = imgAlt;

            const memberLocation = card.querySelector('.member-location');
            detailPanel.querySelector('.detail-location').textContent = memberLocation ? memberLocation.textContent : 'Munich, Germany';

            const detailBio = detailPanel.querySelector('.detail-bio');
            detailBio.innerHTML = '';
            const memberBio = card.querySelector('.member-bio');
            if (memberBio) {
                memberBio.querySelectorAll('li').forEach(li => {
                    const clone = li.cloneNode(true);
                    detailBio.appendChild(clone);
                });
            }

            const linkedinLink = card.querySelector('a[aria-label^="View LinkedIn profile"], a[aria-label^="LinkedIn-Profil"]');
            const detailLinkedin = detailPanel.querySelector('.detail-linkedin');
            if (linkedinLink) {
                detailLinkedin.href = linkedinLink.href;
                detailLinkedin.style.display = '';
            } else {
                detailLinkedin.style.display = 'none';
            }

            const authorLink = card.querySelector('a[aria-label^="View author page"], a[aria-label^="Autorenseite"]');
            const detailAuthor = detailPanel.querySelector('.detail-author');
            if (authorLink) {
                detailAuthor.href = authorLink.href;
                detailAuthor.style.display = '';
            } else {
                detailAuthor.style.display = 'none';
            }

            const cols = getColCount();
            const cardArray = Array.from(cards);
            const cardIndex = cardArray.indexOf(card);
            const rowEnd = Math.min((Math.floor(cardIndex / cols) + 1) * cols, cardArray.length);
            const lastCardInRow = cardArray[rowEnd - 1];

            detailPanel.style.display = 'none';
            detailPanel.classList.remove('open');
            lastCardInRow.after(detailPanel);

            detailPanel.style.display = 'block';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    detailPanel.classList.add('open');
                    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            });
        }

        cards.forEach(card => {
            card.addEventListener('click', () => openPanel(card));
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePanel();
        });
    }

    // Testimonials slider using Swiper.js (independent section)
    if (window.Swiper) {
        new Swiper('.ts-swiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            navigation: {
                nextEl: '.testimonial-arrow-right',
                prevEl: '.testimonial-arrow-left',
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // Team: hide cards beyond first 5 on mobile, with expand button
    const teamShowMore = document.querySelector('.team-show-more');
    const teamGridEl = document.querySelector('.team-grid-equal');
    if (teamShowMore && teamGridEl) {
        const MOBILE_VISIBLE = 5;
        const allCards = teamGridEl.querySelectorAll('.team-member-card');

        function applyMobileHiding() {
            if (window.innerWidth < 768 && !teamGridEl.classList.contains('team-expanded')) {
                allCards.forEach((card, i) => {
                    card.classList.toggle('card-extra', i >= MOBILE_VISIBLE);
                });
                teamShowMore.classList.remove('hidden');
            } else {
                allCards.forEach(card => card.classList.remove('card-extra'));
            }
        }

        applyMobileHiding();

        teamShowMore.addEventListener('click', () => {
            teamGridEl.classList.add('team-expanded');
            allCards.forEach(card => card.classList.remove('card-extra'));
            teamShowMore.classList.add('hidden');
        });
    }

    // Ecosystem arrows: scroll-activated on mobile
    const ecosystemArrows = document.querySelectorAll('.ecosystem-arrow');
    if (ecosystemArrows.length > 0 && window.innerWidth < 768) {
        const items = document.querySelectorAll('.ecosystem-item');

        const arrowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const arrow = entry.target;
                const prev = arrow.previousElementSibling;
                const next = arrow.nextElementSibling;

                if (entry.isIntersecting) {
                    arrow.classList.add('active');
                    if (prev) prev.classList.add('arrow-linked');
                    if (next) next.classList.add('arrow-linked');
                } else {
                    arrow.classList.remove('active');
                    if (prev) prev.classList.remove('arrow-linked');
                    if (next) next.classList.remove('arrow-linked');
                }
            });
        }, { threshold: 0.5 });

        ecosystemArrows.forEach(arrow => arrowObserver.observe(arrow));
    }
});

