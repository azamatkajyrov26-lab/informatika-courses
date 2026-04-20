// ===== MOBILE DRAWER =====
const burger  = document.getElementById('navBurger');
const drawer  = document.getElementById('mobileDrawer');
const overlay = document.getElementById('mobileOverlay');
const closeBtn = document.getElementById('drawerClose');

function openDrawer() {
  overlay.style.display = 'block';
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    drawer.classList.add('open');
  });
  drawer.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  overlay.classList.remove('visible');
  drawer.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { overlay.style.display = 'none'; }, 350);
}

if (burger && drawer && overlay) {
  burger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  // Close drawer when navigating to anchor
  drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => setTimeout(closeDrawer, 150)));
}

// ===== BACK TO TOP =====
const btn = document.getElementById('backTop');
if (btn) {
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Active TOC highlight on scroll
const tocItems = document.querySelectorAll('.toc-item');
const sections = document.querySelectorAll('.content-section[id]');
if (tocItems.length && sections.length) {
  const onScroll = () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    tocItems.forEach(item => {
      const href = item.getAttribute('href') || '';
      item.classList.toggle('active', href === '#' + cur);
      item.querySelector('.toc-dot') && item.querySelector('.toc-dot').classList.toggle('active', href === '#' + cur);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Chapter tabs (index page)
document.querySelectorAll('.chapter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chapter-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
  });
});

// Lang switch
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.lang-switch').querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
  });
});
