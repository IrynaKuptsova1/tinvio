const featurePanels = [
  document.querySelector("#chats-content"),
  document.querySelector("#orders-content"),
  document.querySelector("#payments-content"),
];
const featureTabs = document.querySelectorAll(".features__tabs");

function selectFeature(index, moveFocus = false) {
  if (!featurePanels[index]) return;

  featurePanels.forEach((panel, panelIndex) => {
    if (!panel) return;
    panel.classList.toggle("active", panelIndex === index);
    panel.hidden = panelIndex !== index;
  });

  featureTabs.forEach((group) => {
    group.querySelectorAll(".features__tab").forEach((tab, tabIndex) => {
      tab.classList.toggle("active", tabIndex === index);
      tab.setAttribute("aria-pressed", String(tabIndex === index));
    });
  });

  if (moveFocus) {
    featurePanels[index].querySelectorAll(".features__tab")[index]?.focus({ preventScroll: true });
  }
}

featureTabs.forEach((group) => {
  group.querySelectorAll(".features__tab").forEach((tab, index) => {
    tab.addEventListener("click", () => selectFeature(index, true));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      selectFeature((index + (event.key === "ArrowRight" ? 1 : 2)) % 3, true);
    });
  });
});
selectFeature(0);

const openMenuButton = document.querySelector("#burger-btn1");
const closeMenuButton = document.querySelector("#burger-btn2");
const menu = document.querySelector("#modal");
const mobileLayout = window.matchMedia("(max-width: 900px)");

function setMenuOpen(isOpen) {
  if (!menu || !openMenuButton || !closeMenuButton) return;
  menu.classList.toggle("open", isOpen);
  menu.setAttribute("aria-hidden", String(!isOpen));
  openMenuButton.classList.toggle("open", !isOpen);
  openMenuButton.setAttribute("aria-expanded", String(isOpen));
  closeMenuButton.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);

  if (isOpen) {
    closeMenuButton.focus();
  } else if (menu.contains(document.activeElement)) {
    const target = mobileLayout.matches ? openMenuButton : document.querySelector(".header .logo-wrapper");
    target?.focus({ preventScroll: true });
  }
}

openMenuButton?.addEventListener("click", () => setMenuOpen(true));
closeMenuButton?.addEventListener("click", () => setMenuOpen(false));
menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});
mobileLayout.addEventListener("change", (event) => {
  if (!event.matches) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (!menu?.classList.contains("open")) return;
  if (event.key === "Escape") setMenuOpen(false);
  if (event.key !== "Tab") return;

  const controls = [...menu.querySelectorAll("a[href], button")].filter((element) => {
    return element.getClientRects().length && getComputedStyle(element).visibility !== "hidden";
  });
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

const slider = document.querySelector(".single-item");
if (slider) {
  const slides = [...slider.children].filter((element) => element.tagName === "DIV");
  const dots = document.createElement("ul");
  dots.className = "slick-dots";
  dots.setAttribute("aria-label", "Choose a customer review");
  let activeReview = Math.min(1, slides.length - 1);

  function showReview(index, animate = true) {
    activeReview = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeReview;
    });
    [...dots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("slick-active", dotIndex === activeReview);
      dot.firstElementChild.setAttribute("aria-pressed", String(dotIndex === activeReview));
    });
    if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      slides[activeReview].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
    }
  }

  slides.forEach((slide, index) => {
    slide.classList.add("review-slide");
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Review ${index + 1} of ${slides.length}`);
    button.addEventListener("click", () => showReview(index));
    item.append(button);
    dots.append(item);
  });

  for (const [name, offset, label] of [["prev", -1, "Previous review"], ["next", 1, "Next review"]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slick-${name}`;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => showReview(activeReview + offset));
    slider.append(button);
  }
  slider.append(dots);
  slider.tabIndex = 0;
  slider.setAttribute("aria-label", "Customer reviews");
  slider.setAttribute("aria-roledescription", "carousel");
  slider.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    showReview(activeReview + (event.key === "ArrowRight" ? 1 : -1));
  });
  let pointerStart = null;
  slider.addEventListener("pointerdown", (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  slider.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showReview(activeReview + (dx < 0 ? 1 : -1));
    pointerStart = null;
  });
  slider.addEventListener("pointercancel", () => { pointerStart = null; });
  showReview(activeReview, false);
}

document.querySelectorAll(".get-started-btn, .hero-btn, .burger-modal__get-started-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setMenuOpen(false);
    document.querySelector("#contact")?.scrollIntoView();
  });
});
document.querySelectorAll(".features__btn").forEach((button) => {
  button.addEventListener("click", () => {
    const current = featurePanels.findIndex((panel) => panel?.classList.contains("active"));
    selectFeature((current + 1) % featurePanels.length, true);
  });
});

const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const status = contactForm.querySelector(".contact-form__status");
  if (status) {
    status.hidden = false;
    status.textContent = "Online requests are not available yet. Your details have not been sent.";
  }
});
