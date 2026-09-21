const menu = document.querySelector('.mobile-index');
const headings = [...document.querySelectorAll('main :is(h2, h3, h4, h5, h6)[id]')];
const links = [...document.querySelectorAll('nav a[href^="#"]')];
let selectedId = decodeURIComponent(location.hash.slice(1));

for (const heading of headings) heading.tabIndex = -1;

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target) return;
  selectedId = target.id;
  menu.open = false;
  scheduleUpdate();
  requestAnimationFrame(() => target.focus({ preventScroll: true }));
});

menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});

let pending = false;
function updateLocation() {
  pending = false;
  const boundary = matchMedia('(max-width: 800px)').matches ? 112 : 72;
  let current = null;
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > boundary) break;
    current = heading.id;
  }
  // A destination near the end cannot always reach the top of the viewport.
  // Keep an explicit selection until the reader resumes scrolling.
  if (selectedId) current = selectedId;
  for (const link of links) {
    if (decodeURIComponent(link.hash.slice(1)) === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

function scheduleUpdate() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(updateLocation);
  }
}

function resumeTracking() {
  selectedId = null;
  scheduleUpdate();
}

window.addEventListener('wheel', resumeTracking, { passive: true });
window.addEventListener('touchmove', resumeTracking, { passive: true });
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) resumeTracking();
});
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', () => {
  selectedId = decodeURIComponent(location.hash.slice(1));
  scheduleUpdate();
});
window.addEventListener('load', scheduleUpdate);
document.fonts.ready.then(scheduleUpdate);
updateLocation();
