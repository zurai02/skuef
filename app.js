/* ── RIPPLE CANVAS ANIMATION ── */
(function initRipple() {
  const canvas = document.getElementById('ripple-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, ripples = [], animId;
  const COLORS = ['38,189,248', '14,165,233', '56,189,248', '125,211,252'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawnRipple(x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    ripples.push({ x, y, r: 0, maxR: 120 + Math.random() * 180, alpha: 0.55, color });
  }

  function autoSpawn() {
    if (ripples.length < 12) {
      spawnRipple(
        Math.random() * W,
        Math.random() * H
      );
    }
    setTimeout(autoSpawn, 600 + Math.random() * 1200);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(56,189,248,0.04)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    ripples.forEach((rip, i) => {
      rip.r += 1.2;
      rip.alpha -= 0.008;

      if (rip.alpha <= 0 || rip.r >= rip.maxR) {
        ripples.splice(i, 1);
        return;
      }

      const grad = ctx.createRadialGradient(rip.x, rip.y, rip.r * 0.4, rip.x, rip.y, rip.r);
      grad.addColorStop(0, `rgba(${rip.color},0)`);
      grad.addColorStop(0.7, `rgba(${rip.color},${rip.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${rip.color},0)`);

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rip.color},${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  autoSpawn();
  draw();

  // Burst on click within hero
  canvas.parentElement.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    }
  });
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger bar fills inside
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          const w = bar.dataset.width || 0;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });

        // Trigger counter animations inside
        entry.target.querySelectorAll('[data-target]').forEach(el => {
          animateCounter(el);
        });

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();


/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.round(current).toLocaleString();

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }

  requestAnimationFrame(step);
}


/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── WATER ICON RIPPLE HOVER ── */
document.querySelectorAll('.water-icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transition = 'all 0.2s ease';
    icon.style.boxShadow = '0 0 16px rgba(56,189,248,0.4)';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.boxShadow = 'none';
  });
});


/* ── ACTIVE SECTION HIGHLIGHT (subtle glow on q-block) ── */
(function initGlow() {
  const blocks = document.querySelectorAll('.q-block');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.borderColor = 'rgba(56,189,248,0.2)';
      } else {
        entry.target.style.borderColor = 'rgba(56,189,248,0.08)';
      }
    });
  }, { threshold: 0.4 });

  blocks.forEach(b => io.observe(b));
})();
