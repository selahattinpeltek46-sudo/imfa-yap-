// GÜVEN ENERJİ — site scripts

document.addEventListener('DOMContentLoaded', () => {
  /* Sticky navbar background on scroll */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* Scroll reveal animations */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* Gallery category tabs (visual filter only — placeholder content) */
  const tabs = document.querySelectorAll('.gallery-tab');
  const slots = document.querySelectorAll('[data-category]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      slots.forEach(slot => {
        if (cat === 'all' || slot.dataset.category === cat) {
          slot.style.display = '';
        } else {
          slot.style.display = 'none';
        }
      });
    });
  });

  /* Subtle parallax on hero mountain layers */
  const mtn1 = document.querySelector('.hero-mtn-1');
  const mtn2 = document.querySelector('.hero-mtn-2');
  const towers = document.querySelector('.hero-towers');
  if (mtn1 || mtn2 || towers) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            if (mtn2) mtn2.style.transform = `translateY(${y * 0.12}px)`;
            if (mtn1) mtn1.style.transform = `translateY(${y * 0.06}px)`;
            if (towers) towers.style.transform = `translateY(${y * 0.18}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* Contact form — client-side only demo submission */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }
});
