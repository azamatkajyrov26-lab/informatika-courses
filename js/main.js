// Back to top button
const btn = document.getElementById('backToTop');
if (btn) {
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Animate progress bar on course page (simulate saved progress)
const fill = document.getElementById('progressFill');
const pct = document.getElementById('progressPct');
if (fill && pct) {
  const saved = parseInt(localStorage.getItem('course_kompgram_progress') || '0', 10);
  setTimeout(() => {
    fill.style.width = saved + '%';
    pct.textContent = saved + '%';
    const track = fill.closest('[role=progressbar]');
    if (track) track.setAttribute('aria-valuenow', saved);
  }, 600);
}

// Mark module as visited on click, update progress
const modules = document.querySelectorAll('.module-item');
const TOTAL = modules.length || 6;
if (modules.length) {
  const visited = JSON.parse(localStorage.getItem('course_kompgram_visited') || '[]');
  const refresh = () => {
    const pct2 = Math.round((visited.length / TOTAL) * 100);
    if (fill) { fill.style.width = pct2 + '%'; }
    if (pct) { pct.textContent = pct2 + '%'; }
    const track = fill && fill.closest('[role=progressbar]');
    if (track) track.setAttribute('aria-valuenow', pct2);
    localStorage.setItem('course_kompgram_progress', pct2);
    localStorage.setItem('course_kompgram_visited', JSON.stringify(visited));
  };
  modules.forEach((m, i) => {
    if (visited.includes(i)) m.style.borderColor = 'rgba(0,230,118,0.3)';
    m.addEventListener('click', () => {
      if (!visited.includes(i)) { visited.push(i); refresh(); }
      m.style.borderColor = 'rgba(0,230,118,0.3)';
    });
    m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') m.click(); });
  });
  refresh();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Intersection Observer for fade-up elements
const observer = new IntersectionObserver(entries => {
  entries.forEach(el => {
    if (el.isIntersecting) { el.target.style.opacity = '1'; observer.unobserve(el.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.glass-card, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
  observer.observe(el);
});
