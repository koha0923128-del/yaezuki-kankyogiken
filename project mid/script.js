document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     body lock
  ========================= */
  const lockBody = () => body.classList.add("is-locked");
  const unlockBody = () => body.classList.remove("is-locked");

  /* =========================
     Drawer
  ========================= */
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".drawer");

  if (hamburger && drawer) {
    const openDrawer = () => {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      hamburger.setAttribute("aria-expanded", "true");
      lockBody();
    };

    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      hamburger.setAttribute("aria-expanded", "false");
      unlockBody();
    };

    const toggleDrawer = () => {
      if (drawer.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    hamburger.addEventListener("click", toggleDrawer);

    drawer.addEventListener("click", (e) => {
      if (e.target.matches("[data-close]")) {
        closeDrawer();
      }
    });

    document.querySelectorAll(".drawer__link").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  /* =========================
     Reveal on scroll
  ========================= */
  const revealTargets = document.querySelectorAll(
    ".card, .section__title, .section__text, .about__image, .contact-box"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================
     Hero catch reveal
  ========================= */
  const heroCatch = document.querySelector(".hero-catch--reveal");
  if (heroCatch) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        heroCatch.classList.add("is-visible");
      }, 300);
    });
  }

  /* =========================
     Column modal
  ========================= */
  let columnModal = document.querySelector(".column-modal");

  if (!columnModal) {
    columnModal = document.createElement("div");
    columnModal.className = "column-modal";
    columnModal.innerHTML = `
      <div class="column-modal__inner" role="dialog" aria-modal="true" aria-label="記事">
        <button class="column-modal__close" type="button" aria-label="閉じる">×</button>
        <h2 class="column-modal__title"></h2>
        <div class="column-modal__date"></div>
        <div class="column-modal__body"></div>
      </div>
    `;
    body.appendChild(columnModal);
  }

  const columnModalTitle = columnModal.querySelector(".column-modal__title");
  const columnModalDate = columnModal.querySelector(".column-modal__date");
  const columnModalBody = columnModal.querySelector(".column-modal__body");
  const columnModalClose = columnModal.querySelector(".column-modal__close");

  const openColumnModal = ({ title, date, bodyHTML }) => {
    columnModalTitle.textContent = title || "";
    columnModalDate.textContent = date || "";
    columnModalBody.innerHTML = bodyHTML || "";
    columnModal.classList.add("is-open");
    lockBody();
  };

  const closeColumnModal = () => {
    columnModal.classList.remove("is-open");
    columnModalTitle.textContent = "";
    columnModalDate.textContent = "";
    columnModalBody.innerHTML = "";
    unlockBody();
  };

  /* =========================
     Product modal
  ========================= */
  let productModal = document.querySelector(".product-modal");

  if (!productModal) {
    productModal = document.createElement("div");
    productModal.className = "product-modal";
    productModal.innerHTML = `
      <div class="product-modal__inner" role="dialog" aria-modal="true" aria-label="画像拡大表示">
        <button class="product-modal__close" type="button" aria-label="閉じる">×</button>
        <img class="product-modal__img" alt="">
      </div>
    `;
    body.appendChild(productModal);
  }

  const productModalImg = productModal.querySelector(".product-modal__img");
  const productModalClose = productModal.querySelector(".product-modal__close");

  const openProductModal = ({ src, alt }) => {
    productModalImg.src = src || "";
    productModalImg.alt = alt || "";
    productModal.classList.add("is-open");
    lockBody();
  };

  const closeProductModal = () => {
    productModal.classList.remove("is-open");
    productModalImg.src = "";
    productModalImg.alt = "";
    unlockBody();
  };

  /* =========================
     Global click events
  ========================= */
  document.addEventListener("click", (e) => {
    const postCard = e.target.closest(".js-post");
    if (postCard) {
      const title = postCard.querySelector(".card__title")?.textContent || "";
      const date = postCard.dataset.date || "";
      const bodyHTML = postCard.querySelector(".post-content")?.innerHTML || "";

      openColumnModal({ title, date, bodyHTML });
      return;
    }

    const productCard = e.target.closest(".js-product");
    if (productCard) {
      const img = productCard.querySelector("img");
      if (!img) return;

      openProductModal({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
      });
      return;
    }

    if (e.target === columnModal) {
      closeColumnModal();
      return;
    }

    if (e.target === productModal) {
      closeProductModal();
    }
  });

  /* =========================
     Close buttons
  ========================= */
  if (columnModalClose) {
    columnModalClose.addEventListener("click", closeColumnModal);
  }

  if (productModalClose) {
    productModalClose.addEventListener("click", closeProductModal);
  }

  /* =========================
     Escape key
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (columnModal.classList.contains("is-open")) {
      closeColumnModal();
      return;
    }

    if (productModal.classList.contains("is-open")) {
      closeProductModal();
    }
  });
});