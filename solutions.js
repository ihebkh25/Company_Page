document.addEventListener('DOMContentLoaded', () => {

    const cards = document.querySelectorAll('.sol-card');
    const panels = document.querySelectorAll('.sol-detail-panel');
    const explorerSection = document.querySelector('.sol-explorer-section');
    const cardsRow = document.querySelector('.sol-cards-row');
    const isMobile = () => window.innerWidth < 768;

    // ─── Scroll Reveal ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sol-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => revealObserver.observe(card));

    // ─── Arrange panels: on mobile, each panel sits right after its card ───
    let lastArrangement = null;

    function arrangePanels() {
        const mobile = isMobile();
        if (mobile === lastArrangement) return;
        lastArrangement = mobile;

        closeAllPanels();

        if (mobile) {
            cards.forEach(card => {
                const key = card.dataset.sol;
                const panel = document.querySelector(`.sol-detail-panel[data-panel="${key}"]`);
                card.insertAdjacentElement('afterend', panel);
            });
        } else {
            panels.forEach(panel => explorerSection.appendChild(panel));
        }
    }

    arrangePanels();
    window.addEventListener('resize', arrangePanels);

    // ─── Card Click → Expand/Collapse Panel ───
    function closeAllPanels() {
        panels.forEach(p => p.classList.remove('sol-panel-open'));
        cards.forEach(c => {
            c.classList.remove('sol-active', 'sol-dimmed');
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const solKey = card.dataset.sol;
            const panel = document.querySelector(`.sol-detail-panel[data-panel="${solKey}"]`);
            const isAlreadyOpen = panel.classList.contains('sol-panel-open');

            closeAllPanels();

            if (!isAlreadyOpen) {
                panel.classList.add('sol-panel-open');
                card.classList.add('sol-active');

                cards.forEach(c => {
                    if (c !== card) c.classList.add('sol-dimmed');
                });

                requestAnimationFrame(() => {
                    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            }
        });
    });

    // ─── Close Buttons ───
    document.querySelectorAll('.sol-panel-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    });

    // ─── Panel CTA anchor links: close panel then scroll ───
    document.querySelectorAll('.sol-panel-cta a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = document.querySelector(link.getAttribute('href'));
            closeAllPanels();
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350);
            }
        });
    });

    // ─── Close on Escape ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllPanels();
    });

});
