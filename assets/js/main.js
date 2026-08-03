document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const menuLabel = menuButton?.querySelector('.sr-only');

function setMenuOpen(open) {
  if (!menuButton || !navigation) return;

  menuButton.setAttribute('aria-expanded', String(open));
  navigation.toggleAttribute('data-open', open);

  if (menuLabel) {
    menuLabel.textContent = open
      ? menuButton.dataset.closeLabel
      : menuButton.dataset.openLabel;
  }
}

menuButton?.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const revealElements = [...document.querySelectorAll('[data-reveal]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealAll() {
  revealElements.forEach((element) => element.setAttribute('data-visible', ''));
}

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  try {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-visible', '');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } catch {
    revealAll();
  }
}

const sectionLinks = [...document.querySelectorAll('#primary-nav a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!current) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const languageLink = document.querySelector('.language-link');

function preserveSectionForLanguageLink() {
  if (!languageLink || !window.location.hash) return;
  const target = new URL(languageLink.href, window.location.origin);
  target.hash = window.location.hash;
  languageLink.href = `${target.pathname}${target.hash}`;
}

preserveSectionForLanguageLink();
window.addEventListener('hashchange', preserveSectionForLanguageLink);
