const header = document.querySelector("header");
let menu = document.querySelector("#menu-icon");
let navlist = document.querySelector(".navlist");

// Satu scroll event untuk semua (sticky + active nav)
window.addEventListener("scroll", function () {
  // Sticky header
  header.classList.toggle("sticky", window.scrollY > 50);

  // Tutup menu saat scroll
  menu.classList.remove("bx-x");
  navlist.classList.remove("open");

  // Active nav link
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navlist a");
  sections.forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    if (top >= offset && top < offset + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Toggle mobile menu
menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navlist.classList.toggle("open");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navlist.classList.remove("open");
};

// ===== SLIDER =====
const sliderState = {};

function initSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('a'));
  const total = slides.length;
  if (total === 0) return;

  // Set lebar slider track = total slide * 100%
  slider.style.width = (total * 100) + '%';
  slides.forEach(a => {
    a.style.minWidth = (100 / total) + '%';
  });

  sliderState[sliderId] = { current: 0, total, timer: null };

  // Buat dots
  const dotsId = sliderId.replace('slider-', '');
  const dotsContainer = document.getElementById('dots-' + dotsId);
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => { goToSlide(sliderId, i); restartAutoSlide(sliderId); };
      dotsContainer.appendChild(dot);
    });
  }

  startAutoSlide(sliderId);
}

function goToSlide(sliderId, index) {
  const state = sliderState[sliderId];
  if (!state) return;
  state.current = (index + state.total) % state.total;

  const slider = document.getElementById(sliderId);
  // Geser berdasarkan persentase per slide
  slider.style.transform = `translateX(-${state.current * (100 / state.total)}%)`;

  // Update dots
  const dotsId = 'dots-' + sliderId.replace('slider-', '');
  const dots = document.querySelectorAll(`#${dotsId} .dot`);
  dots.forEach((d, i) => d.classList.toggle('active', i === state.current));
}

function slideMove(sliderId, direction) {
  const state = sliderState[sliderId];
  if (!state) return;
  goToSlide(sliderId, state.current + direction);
  restartAutoSlide(sliderId);
}

function startAutoSlide(sliderId) {
  const state = sliderState[sliderId];
  if (!state) return;
  state.timer = setInterval(() => {
    goToSlide(sliderId, state.current + 1);
  }, 3000);
}

function restartAutoSlide(sliderId) {
  const state = sliderState[sliderId];
  if (!state) return;
  clearInterval(state.timer);
  startAutoSlide(sliderId);
}

window.addEventListener('load', () => {
  initSlider('slider-sipa');
  initSlider('slider-ppdb');
});