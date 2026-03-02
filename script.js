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
});

