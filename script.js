/* ============================================================
   AGENT 3: ANIMATION ENGINEER — Cybersecurity Portfolio JS
   Pure Vanilla JS · Modular · 60fps optimized
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. MATRIX RAIN CANVAS ANIMATION ─────────────────────────
     Renders green falling characters on a canvas at low opacity.
     Used for both the loader and the main background. */
  
  function initMatrixRain(canvasId, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const fontSize = opts.fontSize || 14;
    const color = opts.color || '#00FF41';
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|!@#$%^&*';
    let columns, drops, w, h, animId;

    function resize() {
      w = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      h = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
      columns = Math.floor(w / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.random() * -100);
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.06)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.globalAlpha = 0.4 + Math.random() * 0.6;
        ctx.fillText(char, x, y);
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return {
      stop: () => cancelAnimationFrame(animId),
      start: () => draw()
    };
  }

  /* ── 2. LOADING SCREEN (2-second matrix rain, then fade) ───── */
  
  function initLoader() {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar-fill');
    const progressText = document.getElementById('loader-progress');
    if (!loader) return;

    // Start loader matrix rain
    const loaderRain = initMatrixRain('loader-matrix-canvas', { fontSize: 12 });

    const messages = ['INITIALIZING', 'SCANNING PORTS', 'BYPASSING FIREWALL', 'ACCESS GRANTED'];
    let progress = 0;
    const duration = 2000;
    const startTime = Date.now();

    function updateLoader() {
      const elapsed = Date.now() - startTime;
      progress = Math.min((elapsed / duration) * 100, 100);
      bar.style.width = progress + '%';

      const msgIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
      progressText.textContent = messages[msgIndex];

      if (progress < 100) {
        requestAnimationFrame(updateLoader);
      } else {
        setTimeout(() => {
          loader.classList.add('hidden');
          if (loaderRain) loaderRain.stop();
          // Start all site animations after loader
          initSiteAnimations();
        }, 300);
      }
    }
    requestAnimationFrame(updateLoader);
  }

  /* ── 3. TERMINAL TYPER WITH GLITCH ───────────────────────────
     Types text character by character with 80ms delay.
     Adds glitch frames on the hero name element. */
  
  function typeWriter(element, text, speed, callback) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  function initHeroTyper() {
    const typer = document.getElementById('hero-typer');
    const output = document.getElementById('hero-output');
    const heroName = document.querySelector('.hero-name');
    if (!typer || !output) return;

    const command = 'whoami';
    const outputLines = [
      '<span class="output-line" style="color:#00FF41;">╔══════════════════════════════════════════╗</span>',
      '<span class="output-line" style="color:#C9D1D9;">  Name    : Anshul Vairagade</span>',
      '<span class="output-line" style="color:#C9D1D9;">  Role    : Cyber Security Engineer</span>',
      '<span class="output-line" style="color:#C9D1D9;">  Base    : Nagpur, India</span>',
      '<span class="output-line" style="color:#C9D1D9;">  Status  : <span style="color:#00FF41;">● ACTIVE</span></span>',
      '<span class="output-line" style="color:#00FF41;">╚══════════════════════════════════════════╝</span>',
    ];

    // Type the command
    typeWriter(typer, command, 80, () => {
      // Show output lines sequentially
      let lineIndex = 0;
      function showLine() {
        if (lineIndex < outputLines.length) {
          const div = document.createElement('div');
          div.innerHTML = outputLines[lineIndex];
          div.style.animationDelay = (lineIndex * 0.1) + 's';
          output.appendChild(div);
          lineIndex++;
          setTimeout(showLine, 150);
        } else {
          // Trigger glitch on hero name
          if (heroName) {
            triggerGlitch(heroName);
          }
        }
      }
      setTimeout(showLine, 400);
    });
  }

  /* ── 4. GLITCH EFFECT ON SECTION HEADINGS ────────────────────
     Random glitch every 8 seconds on a random heading. */
  
  function triggerGlitch(el) {
    el.classList.add('glitch-active');
    setTimeout(() => el.classList.remove('glitch-active'), 300);
  }

  function initRandomGlitch() {
    const targets = document.querySelectorAll('.glitch-target');
    if (!targets.length) return;

    setInterval(() => {
      const randomTarget = targets[Math.floor(Math.random() * targets.length)];
      triggerGlitch(randomTarget);
    }, 8000);
  }

  /* ── 5. SCROLL-TRIGGERED COUNTER ANIMATIONS ──────────────────
     Counts up to real numbers with easeOutExpo easing. */
  
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = Date.now();
    let animated = false;

    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(easedProgress * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* ── 6. SCROLL SPY NAV HIGHLIGHTING ──────────────────────────
     Highlights the active nav link based on scroll position. */
  
  function initScrollSpy() {
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('[data-nav]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-nav') === sectionId);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));

    // Nav scroll effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ── 7. CURSOR TRAIL (6 green dots with fade) ────────────────
     Creates 6 dots that trail the cursor with staggered delay. */
  
  function initCursorTrail() {
    // Skip on mobile/touch
    if ('ontouchstart' in window || window.innerWidth < 769) return;

    const dotCount = 6;
    const dots = [];
    const positions = [];

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      dot.style.opacity = (1 - i / dotCount) * 0.7;
      dot.style.width = (6 - i * 0.5) + 'px';
      dot.style.height = (6 - i * 0.5) + 'px';
      document.body.appendChild(dot);
      dots.push(dot);
      positions.push({ x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function updateTrail() {
      positions[0].x += (mouseX - positions[0].x) * 0.3;
      positions[0].y += (mouseY - positions[0].y) * 0.3;

      for (let i = 1; i < dotCount; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.25;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.25;
      }

      dots.forEach((dot, i) => {
        dot.style.transform = `translate(${positions[i].x - 3}px, ${positions[i].y - 3}px)`;
        dot.style.opacity = (1 - i / dotCount) * 0.6;
      });

      requestAnimationFrame(updateTrail);
    }
    requestAnimationFrame(updateTrail);
  }

  /* ── 8. 3D PROJECT CARD FLIP (touch support) ─────────────────
     On mobile, tap to toggle the flip. */
  
  function initProjectFlip() {
    const cards = document.querySelectorAll('.project-flip-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          card.classList.toggle('tapped');
        }
      });
    });
  }

  /* ── 9. INTERSECTION OBSERVER FADE-UP REVEAL ─────────────────
     All elements with .reveal-up fade in and slide up on scroll. */
  
  function initRevealOnScroll() {
    const elements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children slightly
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach((el, i) => {
      el.dataset.delay = (i % 5) * 100; // stagger within each group
      observer.observe(el);
    });
  }

  /* ── 10. EASTER EGG: Type "hackme" anywhere ──────────────────
     Tracks keypresses. If "hackme" is typed anywhere on the page,
     triggers a fake "ACCESS GRANTED" terminal overlay. */
  
  function initEasterEgg() {
    const secret = 'hackme';
    let buffer = '';
    const overlay = document.getElementById('hackme-overlay');
    const textEl = document.getElementById('hackme-text');
    if (!overlay || !textEl) return;

    const hackText = [
      '> Initiating system breach...',
      '> Bypassing firewall... [OK]',
      '> Cracking encryption keys... [OK]',
      '> Extracting root credentials...',
      '> Password: ************',
      '',
      '╔════════════════════════════════════╗',
      '║                                    ║',
      '║     █████╗  ██████╗██████╗███████╗ ║',
      '║    ██╔══██╗██╔════╝██╔═══╝██╔════╝ ║',
      '║    ███████║██║     █████╗ ███████╗  ║',
      '║    ██╔══██║██║     ██╔══╝ ╚════██║  ║',
      '║    ██║  ██║╚██████╗██████╗███████║  ║',
      '║    ╚═╝  ╚═╝ ╚═════╝╚═════╝╚══════╝ ║',
      '║                                    ║',
      '║   ██████╗ ██████╗  █████╗ ███╗  ██╗║',
      '║  ██╔════╝ ██╔══██╗██╔══██╗████╗ ██║║',
      '║  ██║  ███╗██████╔╝███████║██╔██╗██║║',
      '║  ██║   ██║██╔══██╗██╔══██║██║╚████║║',
      '║  ╚██████╔╝██║  ██║██║  ██║██║ ╚███║║',
      '║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝║',
      '║        ACCESS GRANTED              ║',
      '║                                    ║',
      '╚════════════════════════════════════╝',
      '',
      '> Welcome, hacker. You found the easter egg!',
      '> Type "exit" or click anywhere to close.',
    ];

    document.addEventListener('keydown', (e) => {
      // Don't trigger in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (overlay.classList.contains('active')) {
        // Close on Escape or if user types "exit"
        if (e.key === 'Escape') {
          overlay.classList.remove('active');
          textEl.textContent = '';
          buffer = '';
        }
        return;
      }

      buffer += e.key.toLowerCase();
      if (buffer.length > secret.length) {
        buffer = buffer.slice(-secret.length);
      }

      if (buffer === secret) {
        buffer = '';
        overlay.classList.add('active');
        textEl.textContent = '';

        // Type out hack text
        let lineIdx = 0;
        function nextLine() {
          if (lineIdx < hackText.length) {
            textEl.textContent += hackText[lineIdx] + '\n';
            lineIdx++;
            setTimeout(nextLine, 80);
          }
        }
        nextLine();
      }
    });

    // Close overlay on click
    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      textEl.textContent = '';
    });
  }

  /* ── 11. MOBILE NAV TOGGLE ───────────────────────────────── */
  
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });

    // Close nav on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 12. SOUND TOGGLE (Binary beep on hover, off by default) ─
     Uses Web Audio API for a short beep. Off by default. */
  
  function initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    const iconOn = btn?.querySelector('.sound-icon-on');
    const iconOff = btn?.querySelector('.sound-icon-off');
    if (!btn) return;

    let soundEnabled = false;
    let audioCtx = null;

    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      btn.classList.toggle('active', soundEnabled);
      btn.title = soundEnabled ? 'Sound effects (on)' : 'Sound effects (off)';
      if (iconOn && iconOff) {
        iconOn.style.display = soundEnabled ? 'block' : 'none';
        iconOff.style.display = soundEnabled ? 'none' : 'block';
      }
      if (soundEnabled && !audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    });

    function playBeep() {
      if (!soundEnabled || !audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.08);
    }

    // Add beep on hover for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .hex-skill, .project-flip-card, .stat-card, .cert-card, .contact-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', playBeep);
    });
  }

  /* ── MAIN INIT: Called after loader completes ─────────────── */
  
  function initSiteAnimations() {
    // Start main matrix rain
    initMatrixRain('matrix-canvas', { fontSize: 14 });

    // Hero typing animation
    initHeroTyper();

    // Counter animations on scroll
    initCounters();

    // Scroll spy
    initScrollSpy();

    // Cursor trail
    initCursorTrail();

    // Project flip cards
    initProjectFlip();

    // Reveal on scroll
    initRevealOnScroll();

    // Random glitch on headings
    initRandomGlitch();

    // Easter egg
    initEasterEgg();

    // Sound toggle
    initSoundToggle();

    // Mobile nav
    initMobileNav();

    // Career gallery + lightbox
    initGallery();
    initLightbox();
  }

  /* ── Gallery Filter + Lightbox ─────────────────────────────── */

  function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    const visibleCount = document.getElementById('visible-count');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let count = 0;

        items.forEach((item, i) => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
            item.style.animation = 'none';
            item.offsetHeight; // force reflow
            item.style.animation = `galleryFadeIn 0.5s ease ${Math.min(i * 0.04, 0.5)}s forwards`;
            count++;
          } else {
            item.classList.add('hidden');
          }
        });

        if (visibleCount) visibleCount.textContent = count;
      });
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    const lbIndex = document.getElementById('lightbox-index');
    const lbClose = document.getElementById('lightbox-close');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    if (!lightbox || !lbImg) return;

    let currentItems = [];
    let currentIdx = 0;

    function getVisibleItems() {
      return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    function openLightbox(idx) {
      currentItems = getVisibleItems();
      currentIdx = idx;
      showImage();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showImage() {
      if (!currentItems[currentIdx]) return;
      const item = currentItems[currentIdx];
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
      if (lbIndex) lbIndex.textContent = `[ ${currentIdx + 1} / ${currentItems.length} ]`;
    }

    function nextImage() {
      currentIdx = (currentIdx + 1) % currentItems.length;
      showImage();
    }

    function prevImage() {
      currentIdx = (currentIdx - 1 + currentItems.length) % currentItems.length;
      showImage();
    }

    // Click on gallery items to open
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        const idx = visibleItems.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      });
    });

    // Navigation
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage();
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  /* ── BOOT: Start loader when DOM is ready ────────────────── */
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }

})();
