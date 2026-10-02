// Portfolio v2 — microinterações em JS puro, sem dependências.
// Cada feature checa se o elemento existe, então o mesmo arquivo serve a home e as páginas de case.

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

root.classList.add("js");

// ---------- Header: estado de scroll, esconder ao descer, barra de progresso ----------
function setupHeader() {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 24);
    header.classList.toggle("is-hidden", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
    if (progress) progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

// ---------- Menu mobile ----------
function setupMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const panel = document.querySelector(".nav__panel");
  if (!toggle || !panel) return;

  function setOpen(open) {
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav__toggle-text").textContent = open ? "Fechar" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// ---------- Link ativo no menu conforme a seção visível ----------
function setupActiveNav() {
  const links = [...document.querySelectorAll('.nav__list a[href^="#"]')];
  if (!links.length) return;

  const map = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.removeAttribute("aria-current"));
      map.get(entry.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  map.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// ---------- Relógio de São Paulo ----------
function setupClock() {
  const clocks = document.querySelectorAll("[data-clock]");
  if (!clocks.length) return;

  const format = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  const tick = () => clocks.forEach((el) => (el.textContent = `SP ${format.format(new Date())} GMT-3`));
  tick();
  setInterval(tick, 30_000);
}

// ---------- Split de headlines em palavras ----------
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          word.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.textContent = part;
          word.appendChild(inner);
          frag.appendChild(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
        walk(child);
      }
    });
  };

  // leitores de tela leem o texto original, não as palavras fatiadas
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  walk(el);
  el.querySelectorAll(".word > span").forEach((span, i) => span.style.setProperty("--i", i));
}

// ---------- Reveal on scroll ----------
function setupReveal() {
  const splitTargets = document.querySelectorAll("[data-split]");
  if (!reduceMotion) splitTargets.forEach(splitWords);

  const targets = document.querySelectorAll("[data-reveal], [data-split], .step");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((el) => observer.observe(el));
}

// ---------- Contadores ----------
function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
}

// ---------- Cursor customizado ----------
function setupCursor() {
  if (!finePointer || reduceMotion) return;
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  root.classList.add("has-cursor");
  const label = cursor.querySelector(".cursor__label");
  let x = -100, y = -100, rx = -100, ry = -100;
  let running = false;

  const loop = () => {
    // anel com inércia (lerp); para quando alcança o ponteiro para não gastar frames à toa
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    cursor.style.setProperty("--rx", `${rx}px`);
    cursor.style.setProperty("--ry", `${ry}px`);
    if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  };

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    cursor.style.setProperty("--x", `${x}px`);
    cursor.style.setProperty("--y", `${y}px`);
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    const labelled = event.target.closest("[data-cursor]");
    const interactive = event.target.closest("a, button, summary, [role='button']");
    cursor.classList.toggle("is-label", Boolean(labelled));
    cursor.classList.toggle("is-hover", Boolean(interactive) && !labelled);
    if (labelled) label.textContent = labelled.dataset.cursor;
  });

  document.addEventListener("pointerleave", () => cursor.classList.remove("is-hover", "is-label"));
}

// ---------- Botões magnéticos ----------
function setupMagnetic() {
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.3;
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 600);
    });
  });
}

// ---------- Spotlight nos cards ----------
function setupSpotlight() {
  if (!finePointer) return;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

// ---------- Scramble de texto no hover ----------
function setupScramble() {
  if (reduceMotion) return;
  const glyphs = "!<>-_\\/[]{}=+*^?#01";

  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const original = el.textContent;
    let frame = 0;
    let raf = null;

    el.addEventListener("pointerenter", () => {
      cancelAnimationFrame(raf);
      frame = 0;
      const total = original.length * 2;
      const step = () => {
        el.textContent = [...original]
          .map((char, i) => (char === " " || i < frame / 2 ? char : glyphs[(Math.random() * glyphs.length) | 0]))
          .join("");
        frame += 1;
        if (frame <= total) raf = requestAnimationFrame(step);
        else el.textContent = original;
      };
      step();
    });
  });
}

// ---------- Preview flutuante na lista de labs ----------
function setupLabsPreview() {
  const preview = document.querySelector(".labs__preview");
  const rows = document.querySelectorAll(".labs__row[data-preview]");
  if (!preview || !rows.length || !finePointer) return;

  const img = preview.querySelector("img");
  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => {
      img.src = row.dataset.preview;
      preview.classList.add("is-visible");
    });
    row.addEventListener("pointerleave", () => preview.classList.remove("is-visible"));
    row.addEventListener("pointermove", (event) => {
      preview.style.setProperty("--px", `${event.clientX + 24}px`);
      preview.style.setProperty("--py", `${event.clientY - 90}px`);
    });
  });
}

// ---------- Copiar e-mail ----------
function setupCopyEmail() {
  const toast = document.querySelector(".toast");
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async (event) => {
      if (!navigator.clipboard) return; // sem Clipboard API, segue o mailto normalmente
      event.preventDefault();
      try {
        await navigator.clipboard.writeText(el.dataset.copy);
        if (toast) {
          toast.textContent = "E-mail copiado ✓";
          toast.classList.add("is-visible");
          setTimeout(() => toast.classList.remove("is-visible"), 2200);
        }
      } catch {
        window.location.href = el.href;
      }
    });
  });
}

// ---------- Cena 3D do hero: carregada só quando vale a pena ----------
function setupHeroScene() {
  const container = document.querySelector("[data-hero-scene]");
  if (!container || reduceMotion) return;

  const saveData = navigator.connection?.saveData;
  const slowNetwork = /2g/.test(navigator.connection?.effectiveType || "");
  if (saveData || slowNetwork) return;

  const load = () => import("./hero-scene.js").then(({ initHeroScene }) => initHeroScene(container)).catch(() => {});
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));

  if (document.readyState === "complete") idle(load);
  else window.addEventListener("load", () => idle(load), { once: true });
}

setupHeader();
setupMenu();
setupActiveNav();
setupClock();
setupReveal();
setupCounters();
setupCursor();
setupMagnetic();
setupSpotlight();
setupScramble();
setupLabsPreview();
setupCopyEmail();
setupHeroScene();
