const shopTrigger = document.getElementById("shop-trigger");
const learnTrigger = document.getElementById("learn-trigger");
const shopMenu = document.getElementById("shop-mega-menu");
const learnMenu = document.getElementById("learn-mega-menu");

function setupMegaMenu(trigger, menu) {
  trigger.addEventListener("mouseenter", () => {
    menu.classList.add("active");
  });
  trigger.addEventListener("mouseleave", (e) => {
    setTimeout(() => {
      if (!menu.matches(":hover") && !trigger.matches(":hover")) {
        menu.classList.remove("active");
      }
    }, 100);
  });
  menu.addEventListener("mouseleave", (e) => {
    setTimeout(() => {
      if (!menu.matches(":hover") && !trigger.matches(":hover")) {
        menu.classList.remove("active");
      }
    }, 100);
  });
  menu.addEventListener("mouseenter", () => {
    menu.classList.add("active");
  });
}

if (shopTrigger && shopMenu) setupMegaMenu(shopTrigger, shopMenu);
if (learnTrigger && learnMenu) setupMegaMenu(learnTrigger, learnMenu);

const slides = document.querySelectorAll(".hero-banner__slide");
const dots = document.querySelectorAll(".hero-banner__dots .dot");
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));
  slides[index].classList.add("active");
  dots[index].classList.add("active");
  currentSlide = index;
}

function nextSlide() {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 6000);
}

function resetSlider() {
  clearInterval(slideInterval);
  startSlider();
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    resetSlider();
  });
});

if (slides.length > 0) startSlider();

const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileDrawer = document.getElementById("mobile-drawer");
const overlay = document.getElementById("mobile-drawer-overlay");

function openDrawer() {
  mobileBtn.classList.add("active");
  mobileDrawer.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeDrawer() {
  mobileBtn.classList.remove("active");
  mobileDrawer.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

function positionDrawer() {
  const headerEl = document.getElementById("site-header");
  if (!headerEl || !mobileDrawer) return;
  const bottom = headerEl.getBoundingClientRect().bottom;
  mobileDrawer.style.top = bottom + "px";
  mobileDrawer.style.height = `calc(100vh - ${bottom}px)`;
}

if (mobileBtn && mobileDrawer && overlay) {
  mobileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileDrawer.classList.contains("active") ? closeDrawer() : openDrawer();
    positionDrawer();
  });

  overlay.addEventListener("click", closeDrawer);

  window.addEventListener(
    "scroll",
    () => {
      if (mobileDrawer.classList.contains("active")) positionDrawer();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    if (mobileDrawer.classList.contains("active")) positionDrawer();
  });
}

const headerWrapper = document.getElementById("header-wrapper");
const headerEl = document.getElementById("site-header");
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 20) {
      headerEl.classList.add("scrolled");
      headerWrapper.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
      headerWrapper.classList.remove("scrolled");
    }
  },
  { passive: true },
);

const carouselList = document.getElementById("product-carousel-wrapper");
const leftArrow = document.getElementById("carousel-left-arrow");
const rightArrow = document.getElementById("carousel-right-arrow");

if (carouselList && leftArrow && rightArrow) {
  leftArrow.addEventListener("click", () => {
    const cardWidth = document.querySelector(".product-card").clientWidth + 24;
    carouselList.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });

  rightArrow.addEventListener("click", () => {
    const cardWidth = document.querySelector(".product-card").clientWidth + 24;
    carouselList.scrollBy({ left: cardWidth, behavior: "smooth" });
  });

  const toggleArrows = () => {
    const isAtStart = carouselList.scrollLeft <= 5;
    const isAtEnd =
      carouselList.scrollLeft + carouselList.clientWidth >=
      carouselList.scrollWidth - 5;
    leftArrow.style.opacity = isAtStart ? "0.35" : "1";
    leftArrow.style.pointerEvents = isAtStart ? "none" : "auto";
    rightArrow.style.opacity = isAtEnd ? "0.35" : "1";
    rightArrow.style.pointerEvents = isAtEnd ? "none" : "auto";
  };

  carouselList.addEventListener("scroll", toggleArrows);
  window.addEventListener("resize", toggleArrows);

  const paginationBars = document.querySelectorAll(
    "#carousel-pagination-bars .pagination-bar",
  );

  const updatePagination = () => {
    const maxScroll = carouselList.scrollWidth - carouselList.clientWidth;
    if (maxScroll <= 0) return;

    const scrollPct = carouselList.scrollLeft / maxScroll;
    let activeIndex = 0;

    if (scrollPct < 0.25) {
      activeIndex = 0;
    } else if (scrollPct >= 0.25 && scrollPct < 0.75) {
      activeIndex = 1;
    } else {
      activeIndex = 2;
    }

    paginationBars.forEach((bar, idx) => {
      if (idx === activeIndex) {
        bar.classList.add("active");
      } else {
        bar.classList.remove("active");
      }
    });
  };

  carouselList.addEventListener("scroll", updatePagination);
  window.addEventListener("resize", updatePagination);

  paginationBars.forEach((bar) => {
    bar.addEventListener("click", () => {
      const page = parseInt(bar.getAttribute("data-page"));
      const maxScroll = carouselList.scrollWidth - carouselList.clientWidth;
      let targetScroll = 0;

      if (page === 0) {
        targetScroll = 0;
      } else if (page === 1) {
        targetScroll = maxScroll / 2;
      } else if (page === 2) {
        targetScroll = maxScroll;
      }

      carouselList.scrollTo({ left: targetScroll, behavior: "smooth" });
    });
  });

  toggleArrows();
  updatePagination();
}

const originsSection = document.getElementById("origins-section");
const originsPanels = document.querySelectorAll(".origins-step-panel");

if (originsSection && originsPanels.length > 0) {
  const handleScrollParallax = () => {
    if (window.innerWidth <= 768) {
      originsPanels.forEach((panel) => {
        panel.classList.add("active");
      });
      return;
    }

    const rect = originsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalHeight = rect.height - viewportHeight;

    if (totalHeight <= 0) return;

    const scrollCurrent = -rect.top;
    const pct = Math.max(0, Math.min(1, scrollCurrent / totalHeight));

    let activePanelIndex = 0;

    if (pct < 0.33) {
      activePanelIndex = 0;
    } else if (pct >= 0.33 && pct < 0.66) {
      activePanelIndex = 1;
    } else {
      activePanelIndex = 2;
    }

    originsPanels.forEach((panel, idx) => {
      if (idx === activePanelIndex) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScrollParallax, { passive: true });
  window.addEventListener("resize", handleScrollParallax, { passive: true });

  handleScrollParallax();
}

const baristaBlends = [
  {
    title: "Matcha Latte Mix",
    tag: "BARISTA",
    desc: "Our Barista Matcha will satisfy those who like to enjoy a sweet treat. Pure Japanese matcha blends with cane sugar to make for a rich and satisfying sipping experience.",
    img: "https://www.twoleavestea.com/cdn/shop/files/Barista_Matcha_new_pack.webp?v=1773888021&width=600",
    link: "/products/barista-matcha-tea-latte-mix",
    secBg: "#0f522b",
    cardBg: "#aae575",
    badgeBg: "#4ca62e",
  },
  {
    title: "Chai Latte Mix",
    tag: "NICE",
    desc: "Our Nice Chai is a not too sweet, not too spicy, powdered latte mix meant for making tea lattes simple.",
    img: "https://www.twoleavestea.com/cdn/shop/files/Nice_Chai.webp?v=1773826534&width=600",
    link: "/products/nice-chai-latte-mix",
    secBg: "#9b5a26",
    cardBg: "#f8c499",
    badgeBg: "#ea6d44",
  },
  {
    title: "Matcha Latte Mix",
    tag: "NICE",
    desc: "A mix of finely ground green tea and just enough sweetness to blend into delicious matcha lattes or smoothies.",
    img: "https://www.twoleavestea.com/cdn/shop/files/Nice_Matcha.webp?v=1773826579&width=600",
    link: "/products/nice-matcha-green-tea",
    secBg: "#3e6511",
    cardBg: "#b0ea6f",
    badgeBg: "#73bc25",
  },
  {
    title: "Golden Latte",
    tag: "TWO ROOTS",
    desc: "Naturally caffeine-free blend of spice and sweetness for making golden lattes simple. Only 6 grams of sugar per serving makes this spicy and sweet treat totally satisfying.",
    img: "https://www.twoleavestea.com/cdn/shop/files/Two_Roots.webp?v=1773826580&width=600",
    link: "/products/two-roots-turmeric-ginger-latte-mix",
    secBg: "#955f00",
    cardBg: "#ffd56b",
    badgeBg: "#ffb500",
  },
  {
    title: "Chai Latte Mix",
    tag: "BARISTA",
    desc: "Real spices blend with cane sugar and Indian and African black teas to make for an indulgent and spicy sipping experience.",
    img: "https://www.twoleavestea.com/cdn/shop/files/Barista_Chai.webp?v=1773826579&width=600",
    link: "/products/barista-chai-tea-latte-mix",
    secBg: "#6c2e1f",
    cardBg: "#f3af9b",
    badgeBg: "#c54b38",
  },
];

let currentBaristaIdx = 0;
const secEl = document.getElementById("barista-section");
const cardEl = document.getElementById("barista-active-card");
const imgEl = document.getElementById("barista-product-img");
const badgeEl = document.getElementById("barista-tilted-badge");
const titleEl = document.getElementById("barista-product-title");
const descEl = document.getElementById("barista-product-desc");
const linkEl = document.getElementById("barista-shop-btn");
const prevBtn = document.getElementById("barista-prev-btn");
const nextBtn = document.getElementById("barista-next-btn");

function updateBaristaSlide(idx) {
  if (!secEl || !cardEl || !imgEl) return;
  currentBaristaIdx = idx;
  const blend = baristaBlends[idx];

  imgEl.classList.remove("barista-fade-in-img");
  badgeEl.classList.remove("barista-fade-in-text");
  titleEl.classList.remove("barista-fade-in-text");
  descEl.classList.remove("barista-fade-in-text");
  linkEl.classList.remove("barista-fade-in-text");

  void imgEl.offsetWidth;

  imgEl.src = blend.img;
  imgEl.alt = blend.title;
  badgeEl.textContent = blend.tag;
  titleEl.textContent = blend.title;
  descEl.textContent = blend.desc;
  linkEl.href = blend.link;

  secEl.style.backgroundColor = blend.secBg;
  cardEl.style.backgroundColor = blend.cardBg;
  badgeEl.style.backgroundColor = blend.badgeBg;

  imgEl.classList.add("barista-fade-in-img");
  badgeEl.classList.add("barista-fade-in-text");
  titleEl.classList.add("barista-fade-in-text");
  descEl.classList.add("barista-fade-in-text");
  linkEl.classList.add("barista-fade-in-text");
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    let idx =
      (currentBaristaIdx - 1 + baristaBlends.length) % baristaBlends.length;
    updateBaristaSlide(idx);
  });

  nextBtn.addEventListener("click", () => {
    let idx = (currentBaristaIdx + 1) % baristaBlends.length;
    updateBaristaSlide(idx);
  });

  updateBaristaSlide(0);
}

const blogCarouselList = document.getElementById("blog-carousel-wrapper");
const blogLeftArrow = document.getElementById("blog-carousel-left-arrow");
const blogRightArrow = document.getElementById("blog-carousel-right-arrow");

if (blogCarouselList && blogLeftArrow && blogRightArrow) {
  blogLeftArrow.addEventListener("click", () => {
    const cardWidth = document.querySelector(".blog-card").clientWidth + 24;
    blogCarouselList.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });

  blogRightArrow.addEventListener("click", () => {
    const cardWidth = document.querySelector(".blog-card").clientWidth + 24;
    blogCarouselList.scrollBy({ left: cardWidth, behavior: "smooth" });
  });

  const toggleBlogArrows = () => {
    const isAtStart = blogCarouselList.scrollLeft <= 5;
    const isAtEnd =
      blogCarouselList.scrollLeft + blogCarouselList.clientWidth >=
      blogCarouselList.scrollWidth - 5;
    blogLeftArrow.style.opacity = isAtStart ? "0.35" : "1";
    blogLeftArrow.style.pointerEvents = isAtStart ? "none" : "auto";
    blogRightArrow.style.opacity = isAtEnd ? "0.35" : "1";
    blogRightArrow.style.pointerEvents = isAtEnd ? "none" : "auto";
  };

  blogCarouselList.addEventListener("scroll", toggleBlogArrows);
  window.addEventListener("resize", toggleBlogArrows);
  const blogPaginationBars = document.querySelectorAll(
    "#blog-carousel-pagination-bars .blog-pagination-bar",
  );

  const updateBlogPagination = () => {
    const maxScroll =
      blogCarouselList.scrollWidth - blogCarouselList.clientWidth;
    if (maxScroll <= 0) return;

    const scrollPct = blogCarouselList.scrollLeft / maxScroll;
    let activeIndex = 0;

    if (scrollPct < 0.25) {
      activeIndex = 0;
    } else if (scrollPct >= 0.25 && scrollPct < 0.75) {
      activeIndex = 1;
    } else {
      activeIndex = 2;
    }

    blogPaginationBars.forEach((bar, idx) => {
      if (idx === activeIndex) {
        bar.classList.add("active");
      } else {
        bar.classList.remove("active");
      }
    });
  };

  blogCarouselList.addEventListener("scroll", updateBlogPagination);
  window.addEventListener("resize", updateBlogPagination);

  blogPaginationBars.forEach((bar) => {
    bar.addEventListener("click", () => {
      const page = parseInt(bar.getAttribute("data-page"));
      const maxScroll =
        blogCarouselList.scrollWidth - blogCarouselList.clientWidth;
      let targetScroll = 0;

      if (page === 0) {
        targetScroll = 0;
      } else if (page === 1) {
        targetScroll = maxScroll / 2;
      } else if (page === 2) {
        targetScroll = maxScroll;
      }

      blogCarouselList.scrollTo({ left: targetScroll, behavior: "smooth" });
    });
  });
  toggleBlogArrows();
  updateBlogPagination();
}
