const THEME_KEY = "neuroide-theme";
let cachedSearchIndex = null;
const SEARCH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "from",
  "how",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const NAV_ITEMS = [
  { href: "/index.html", label: "Home", key: "home" },
  { href: "/perception.html", label: "Perception", key: "perception" },
  { href: "/intelligence.html", label: "Intelligence", key: "intelligence" },
  { href: "/action.html", label: "Action", key: "action" },
  { href: "/about.html", label: "About", key: "about" },
];

const SOCIAL_LINKS = {
  github: "https://github.com/neuroide",
  youtube: "https://youtube.com/neuroide",
  linkedin: "https://www.linkedin.com/in/neuroide/",
  x: "https://x.com/neuroide_",
};

const SOCIAL_ICONS = {
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.57 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.39.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.87.58 9.39.58 9.39.58s7.52 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.3 3.7-6.3 3.7Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A1.98 1.98 0 1 0 5 7.46a1.98 1.98 0 0 0-.02-3.96ZM3.5 8.75h3V20.5h-3V8.75Zm5.5 0h2.88v1.6h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.59 2 3.59 4.59v7.12h-3v-6.31c0-1.5-.03-3.43-2.09-3.43-2.1 0-2.42 1.64-2.42 3.32v6.42H9V8.75Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.88-6.97L5.98 22H2.87l7.24-8.27L.5 2h6.4l4.4 6.3L18.9 2Zm-1.1 18h1.72L5.97 3.9H4.12L17.8 20Z"/></svg>',
};

function buildSocialLinks() {
  return [
    { key: "github", label: "GitHub" },
    { key: "youtube", label: "YouTube" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "x", label: "Twitter or X" },
  ].map(({ key, label }) =>
    `<a class="social-link" href="${SOCIAL_LINKS[key]}" aria-label="${label}">${
      SOCIAL_ICONS[key]
    }</a>`
  ).join("");
}

const SEARCH_ICON_MARKUP = `
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M10.5 4a6.5 6.5 0 0 1 5.154 10.463l4.19 4.19-1.414 1.414-4.19-4.19A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/>
    </svg>
`;

bootstrapInitialTheme();

function bootstrapInitialTheme() {
  try {
    document.documentElement.setAttribute("data-theme", getPreferredTheme());
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

function toggleMenu() {
  const panel = document.getElementById("navLinks");
  const toggle = document.getElementById("menuToggle");
  if (!panel || !toggle) return;
  const nextState = !panel.classList.contains("open");
  panel.classList.toggle("open", nextState);
  toggle.setAttribute("aria-expanded", String(nextState));
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/index.html";
  return pathname;
}

function getDeclaredNavKey() {
  const declared = document.querySelector('meta[name="neuroide-nav"]')?.content
    ?.trim().toLowerCase();
  if (
    ["home", "perception", "intelligence", "action", "search", "about"]
      .includes(declared)
  ) {
    return declared;
  }
  return null;
}

function getActiveNavKey(pathname) {
  const declared = getDeclaredNavKey();
  if (declared) return declared;
  const normalized = normalizePath(pathname);
  if (normalized === "/about.html") return "about";
  if (normalized === "/search.html") return "search";
  if (normalized === "/perception.html") return "perception";
  if (normalized === "/intelligence.html") return "intelligence";
  if (normalized === "/action.html") return "action";
  if (
    normalized.startsWith("/topics/signals/") ||
    normalized.startsWith("/topics/multimodal-sensing/") ||
    normalized.startsWith("/topics/physiological-systems/")
  ) return "perception";
  if (
    normalized.startsWith("/topics/ml/") ||
    normalized.startsWith("/topics/genai/") ||
    normalized.startsWith("/topics/representation-and-inference/")
  ) return "intelligence";
  if (
    normalized.startsWith("/topics/robotics/") ||
    normalized.startsWith("/topics/control-and-planning/") ||
    normalized.startsWith("/topics/validation-and-simulation/")
  ) return "action";
  return "home";
}

function buildNavList(activeKey, includeSearch) {
  const items = [...NAV_ITEMS];
  if (includeSearch) {
    items.splice(items.length - 1, 0, {
      href: "/search.html",
      label: "Search",
      key: "search",
      isSearch: true,
    });
  }

  return items.map((item) => {
    const classes = [];
    if (item.key === activeKey) classes.push("active");
    if (item.isSearch) classes.push("nav-search-link");
    const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
    return `<li><a href="${item.href}"${classAttr}>${item.label}</a></li>`;
  }).join("");
}

function buildSearchForm(className, currentQuery = "") {
  const safeQuery = currentQuery.replace(/"/g, "&quot;");
  return `
        <div class="${className}" role="search">
            <span class="site-search-icon" aria-hidden="true">${SEARCH_ICON_MARKUP}</span>
            <button class="site-search-trigger" type="button" data-search-trigger="true" data-initial-query="${safeQuery}" aria-keyshortcuts="Meta+K Control+K">Search Articles</button>
            <span class="search-shortcut" aria-hidden="true">${
    navigator.platform.includes("Mac") ? "⌘ + K" : "Ctrl + K"
  }</span>
        </div>
    `;
}

function buildMobileSearchPanel(currentQuery = "") {
  const safeQuery = currentQuery.replace(/"/g, "&quot;");
  return `
        <div class="mobile-search-shell">
            <button id="mobileSearchToggle" class="mobile-search-toggle" type="button" aria-expanded="false" aria-controls="searchOverlay" data-initial-query="${safeQuery}">
                <span class="site-search-icon mobile-search-toggle-icon" aria-hidden="true">${SEARCH_ICON_MARKUP}</span>
            </button>
        </div>
    `;
}

function buildSearchOverlay() {
  if (document.getElementById("searchOverlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "searchOverlay";
  overlay.className = "search-overlay";
  overlay.innerHTML = `
        <div class="search-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="searchOverlayTitle">
            <div class="search-overlay-head">
                <span class="sr-only" id="searchOverlayTitle">Search Neuroide</span>
                <span class="search-overlay-icon" aria-hidden="true">${SEARCH_ICON_MARKUP}</span>
                <input id="searchOverlayInput" class="search-overlay-input" type="search" autocomplete="off" placeholder="Search pillars, programs, and articles">
                <button id="searchOverlayClose" class="search-overlay-close" type="button" aria-label="Close search">×</button>
            </div>
            <div class="search-overlay-body">
                <div id="searchOverlayResults" class="search-overlay-results">
                    <p class="small-text">Start typing to search the site.</p>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(overlay);
}

function initializeHeader() {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  const activeKey = getActiveNavKey(window.location.pathname);
  const currentQuery = new URLSearchParams(window.location.search).get("q") ||
    "";

  nav.innerHTML = `
        <a href="/index.html" class="logo" aria-label="Neuroide home">
            <img src="/fig/neuroide.png" alt="Neuroide">
        </a>
        <div class="nav-primary-shell" aria-label="Primary navigation">
            <div class="nav-primary">
                <ul class="nav-links">
                    ${buildNavList(activeKey, false)}
                </ul>
            </div>
        </div>
        <div class="nav-utilities">
            ${buildSearchForm("site-search-form desktop-search", currentQuery)}
            ${buildMobileSearchPanel(currentQuery)}
        </div>
        <button id="menuToggle" class="menu-toggle" type="button" onclick="toggleMenu()" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">☰</button>
        <div id="navLinks" class="nav-links-panel">
            <ul class="nav-links nav-links-mobile">
                ${buildNavList(activeKey, false)}
            </ul>
        </div>
    `;
}

function initializeFooter() {
  const footer = document.querySelector("footer.site-footer");
  if (!footer) return;
  const year = new Date().getFullYear();

  footer.innerHTML = `
        <div class="container footer-grid">
            <div>&copy; ${year} Neuroide. All rights reserved.</div>
            <div class="footer-social" aria-label="Social media links">
                ${buildSocialLinks()}
            </div>
        </div>
    `;
}

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.innerHTML = theme === "dark"
      ? '<span aria-hidden="true">☀</span>'
      : '<span aria-hidden="true">☾</span>';
    toggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    );
    toggle.setAttribute(
      "title",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    );
  }
}

function ensureThemeToggle() {
  const utilities = document.querySelector(".nav-utilities");
  if (!utilities || document.getElementById("themeToggle")) return;

  const toggle = document.createElement("button");
  toggle.id = "themeToggle";
  toggle.className = "theme-toggle";
  toggle.type = "button";
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") ||
      "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  utilities.appendChild(toggle);
  applyTheme(getPreferredTheme());
}

async function loadSearchIndex() {
  if (cachedSearchIndex) return cachedSearchIndex;
  const response = await fetch("/data/search.json");
  const rawIndex = await response.json();
  cachedSearchIndex = rawIndex.map((entry) => {
    const searchBlob = normalizeSearchValue([
      entry.title,
      entry.pillar || "",
      entry.topic,
      entry.type,
      entry.excerpt,
      entry.keywords || "",
    ].join(" "));

    return {
      ...entry,
      _searchBlob: searchBlob,
      _titleBlob: normalizeSearchValue(entry.title),
      _topicBlob: normalizeSearchValue(`${entry.pillar || ""} ${entry.topic}`),
      _keywordBlob: normalizeSearchValue(entry.keywords || ""),
      _typeBlob: normalizeSearchValue(entry.type),
      _tokenSet: new Set(tokenizeSearchValue(searchBlob)),
    };
  });
  return cachedSearchIndex;
}

function normalizeSearchValue(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenizeSearchValue(value) {
  return normalizeSearchValue(value)
    .split(/\s+/)
    .filter(Boolean);
}

function getSearchTokens(query) {
  const normalizedTokens = tokenizeSearchValue(query);
  const filteredTokens = normalizedTokens.filter((token) =>
    token.length > 1 && !SEARCH_STOPWORDS.has(token)
  );
  return [
    ...new Set(filteredTokens.length ? filteredTokens : normalizedTokens),
  ];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getHierarchyParts(value) {
  return String(value)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatHierarchyContent(value) {
  const parts = getHierarchyParts(value);
  if (parts.length < 2) {
    return escapeHtml(value);
  }

  const pillar = escapeHtml(parts[0]);
  const program = escapeHtml(parts.slice(1).join(" / "));
  return `
        <span class="meta-pillar">${pillar}</span>
        <span class="meta-separator" aria-hidden="true">/</span>
        <span class="meta-program">${program}</span>
    `.trim();
}

function enhanceTaxonomyMarkup(root = document) {
  root.querySelectorAll(".article-meta").forEach((meta) => {
    if (meta.dataset.taxonomyEnhanced === "true") return;
    const spans = Array.from(meta.querySelectorAll(":scope > span"));
    if (!spans.length) return;

    meta.classList.add("taxonomy-refined");

    const [hierarchy, type, focus] = spans;
    if (hierarchy) {
      hierarchy.className = "meta-hierarchy";
      hierarchy.innerHTML = formatHierarchyContent(hierarchy.textContent);
    }
    if (type) type.className = "meta-type";
    if (focus) focus.className = "meta-focus";

    meta.dataset.taxonomyEnhanced = "true";
  });

  root.querySelectorAll(".content-meta").forEach((meta) => {
    if (meta.dataset.taxonomyEnhanced === "true") return;
    const spans = Array.from(meta.querySelectorAll(":scope > span"));
    if (!spans.length) return;

    meta.classList.add("taxonomy-refined");

    const first = spans[0];
    const second = spans[1];
    const third = spans[2];
    const firstText = first?.textContent.trim() || "";

    if (first && firstText.includes("/")) {
      first.className = "meta-hierarchy";
      first.innerHTML = formatHierarchyContent(firstText);
      if (second) second.className = "meta-type";
      if (third) third.className = "meta-focus";
    } else if (
      first &&
      (firstText === "Topic Program" || firstText === "Research Pillar")
    ) {
      first.className = "meta-kind";
      if (second) second.className = "meta-program";
      if (third) third.className = "meta-focus";
    } else {
      if (first) first.className = "meta-type";
      if (second) second.className = "meta-focus";
      if (third) third.className = "meta-focus";
    }

    meta.dataset.taxonomyEnhanced = "true";
  });

  root.querySelectorAll(".article-aside-list").forEach((list) => {
    const rows = Array.from(list.querySelectorAll(":scope > div"));
    rows.forEach((row) => {
      const dt = row.querySelector("dt");
      const dd = row.querySelector("dd");
      if (!dt || !dd || row.dataset.taxonomyEnhanced === "true") return;

      const label = dt.textContent.trim();
      const value = dd.textContent.trim();

      if (label === "Topic" && value.includes("/")) {
        dt.textContent = "Pillar / Program";
        dd.innerHTML = `<span class="meta-hierarchy">${
          formatHierarchyContent(value)
        }</span>`;
      } else if (label === "Domain") {
        dt.textContent = "Focus";
      }

      row.dataset.taxonomyEnhanced = "true";
    });
  });
}

function enhanceNoteItems(root = document) {
  root.querySelectorAll(".note-item").forEach((item) => {
    if (item.dataset.noteEnhanced === "true") return;

    const href = item.getAttribute("href") || "";
    const explicitKind = item.dataset.noteKind;
    const isProgram = explicitKind
      ? explicitKind === "program"
      : href.endsWith("/index.html");
    const label = isProgram ? "Topic Program" : "Article";
    const action = isProgram ? "Explore" : "Read";
    const kind = isProgram ? "program" : "article";
    const meta = item.querySelector(".content-meta");

    item.classList.add(isProgram ? "note-item-program" : "note-item-article");
    item.dataset.noteKind = kind;

    const header = document.createElement("div");
    header.className = "note-item-header";
    header.innerHTML = `
            <span class="note-item-label note-item-label-${kind}">
                <span class="note-item-label-dot" aria-hidden="true"></span>
                <span>${label}</span>
            </span>
        `;

    item.prepend(header);

    if (meta) {
      const spans = Array.from(meta.querySelectorAll(":scope > span"));
      if (spans.length > 1) {
        const firstText = spans[0].textContent.trim();
        if (
          firstText === "Topic Program" || firstText === "Research Pillar" ||
          firstText === "Article"
        ) {
          spans[0].remove();
        }
      }
      header.insertAdjacentElement("afterend", meta);
    }

    const footer = document.createElement("div");
    footer.className = "note-item-footer";
    footer.innerHTML = `<span class="note-item-action">${action}</span>`;
    item.appendChild(footer);
    item.dataset.noteEnhanced = "true";
  });
}

function getPillarHrefFromTopicSlug(slug) {
  if (
    ["signals", "multimodal-sensing", "physiological-systems"].includes(slug)
  ) return "/perception.html";
  if (["ml", "genai", "representation-and-inference"].includes(slug)) {
    return "/intelligence.html";
  }
  if (
    ["robotics", "control-and-planning", "validation-and-simulation"].includes(
      slug,
    )
  ) return "/action.html";
  return "/index.html";
}

function getTopicPageContext() {
  const path = window.location.pathname;
  if (path === "/perception.html") {
    return {
      backHref: "/index.html",
      backLabel: "Back to Home",
      kind: "pillar",
      family: "Perception",
    };
  }
  if (path === "/intelligence.html") {
    return {
      backHref: "/index.html",
      backLabel: "Back to Home",
      kind: "pillar",
      family: "Intelligence",
    };
  }
  if (path === "/action.html") {
    return {
      backHref: "/index.html",
      backLabel: "Back to Home",
      kind: "pillar",
      family: "Action",
    };
  }

  const match = path.match(/^\/topics\/([^/]+)\/index\.html$/);
  if (!match) return null;

  const slug = match[1];
  const backHref = getPillarHrefFromTopicSlug(slug);
  const backLabel = backHref === "/index.html"
    ? "Back to Home"
    : `Back to ${
      backHref.replace("/", "").replace(".html", "").replace(/-/g, " ").replace(
        /\b\w/g,
        (char) => char.toUpperCase(),
      )
    }`;

  return {
    backHref,
    backLabel,
    kind: "program",
    family: backLabel.replace("Back to ", ""),
  };
}

function getPillarArticleGroups(index, pillar) {
  const topicEntries = index.filter((entry) =>
    entry.pillar === pillar && entry.type === "Topic"
  );
  const articleEntries = index.filter((entry) =>
    entry.pillar === pillar && ["Article", "Research Idea"].includes(entry.type)
  );

  return topicEntries.map((topicEntry) => ({
    title: topicEntry.title,
    href: topicEntry.url,
    items: articleEntries
      .filter((entry) => entry.topic === topicEntry.title)
      .sort((left, right) => left.title.localeCompare(right.title)),
  })).filter((group) => group.items.length);
}

function renderPillarAside(groups, context) {
  const articleCount = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );
  const summary = articleCount === 1 ? "1 article" : `${articleCount} articles`;
  const groupMarkup = groups.map((group) => `
            <section class="topic-aside-group">
                <a class="topic-aside-group-link" href="${group.href}">${
    escapeHtml(group.title)
  }</a>
                <div class="topic-aside-link-list">
                    ${
    group.items.map((item) => `
                        <a class="topic-aside-link" href="${item.url}">
                            <span class="topic-aside-link-title">${
      escapeHtml(item.title)
    }</span>
                            <span class="topic-aside-link-type">${
      escapeHtml(item.type)
    }</span>
                        </a>
                    `).join("")
  }
                </div>
            </section>
        `).join("");

  return `
        <div class="topic-aside-card topic-aside-card-contents">
            <span class="eyebrow">All Articles</span>
            <p class="small-text">${summary} under ${
    escapeHtml(context.family)
  }, grouped by topic.</p>
            <div class="topic-aside-groups">${groupMarkup}</div>
        </div>
        <a class="topic-back-link page-back-link" href="${context.backHref}">
            <span class="page-back-link-icon" aria-hidden="true">←</span>
            <span>${escapeHtml(context.backLabel)}</span>
        </a>
    `;
}

async function enhanceTopicLayouts(root = document) {
  const context = getTopicPageContext();
  if (!context) return;

  let searchIndex = null;
  if (context.kind === "pillar") {
    try {
      searchIndex = await loadSearchIndex();
    } catch (_error) {
      searchIndex = null;
    }
  }

  root.querySelectorAll(".topic-layout").forEach((layout) => {
    if (layout.dataset.topicLayoutEnhanced === "true") return;

    const sections = Array.from(layout.children);
    if (!sections.length) return;

    const header = layout.querySelector(".topic-header");
    const intro = header?.querySelector(".page-intro")?.textContent.trim() ||
      "";
    const eyebrow = header?.querySelector(".eyebrow")?.textContent.trim() || "";
    const topicTitle =
      header?.querySelector(".topic-title")?.textContent.trim() || "";
    const sectionLabels = Array.from(
      layout.querySelectorAll(".info-panel > .eyebrow"),
    )
      .map((label) => label.textContent.trim())
      .filter(Boolean);
    const noteItems = Array.from(
      layout.querySelectorAll(".note-list > .note-item"),
    );
    const programCount = noteItems.filter((item) =>
      (item.getAttribute("href") || "").endsWith("/index.html")
    ).length;
    const pillarArticleGroups = searchIndex
      ? getPillarArticleGroups(searchIndex, context.family)
      : [];
    const indexedArticleCount = pillarArticleGroups.reduce(
      (total, group) =>
        total + group.items.length,
      0,
    );
    const articleCount = context.kind === "pillar" && indexedArticleCount
      ? indexedArticleCount
      : noteItems.length - programCount;
    const stats = [];

    if (context.kind === "pillar") {
      stats.push(`${programCount} topic programs`);
      stats.push(`${articleCount} articles`);
    } else if (noteItems.length) {
      stats.push(`${noteItems.length} featured reads`);
    }
    if (sectionLabels.length) {
      stats.push(`${sectionLabels.length} sections`);
    }

    const quickLinks = noteItems.slice(0, 3).map((item) => {
      const href = item.getAttribute("href") || "#";
      const label = item.querySelector("h3")?.textContent.trim() || "Explore";
      return `<a href="${href}">${escapeHtml(label)}</a>`;
    }).join("");

    if (header && !header.querySelector(".topic-header-band")) {
      const statMarkup = stats.map((stat) => `<span>${escapeHtml(stat)}</span>`)
        .join("");
      header.insertAdjacentHTML(
        "beforeend",
        `
                <div class="topic-header-band">
                    <div class="topic-header-stats">${statMarkup}</div>
                    ${
          quickLinks
            ? `<div class="topic-header-links">${quickLinks}</div>`
            : ""
        }
                </div>
            `,
      );
    }

    const main = document.createElement("div");
    main.className = "topic-main";
    sections.forEach((section) => main.appendChild(section));

    const aside = document.createElement("aside");
    aside.className = "topic-aside";
    if (context.kind === "pillar" && pillarArticleGroups.length) {
      aside.innerHTML = renderPillarAside(pillarArticleGroups, context);
    } else {
      const hierarchyMarkup = eyebrow.includes("/")
        ? formatHierarchyContent(eyebrow)
        : escapeHtml(eyebrow || context.family);

      const sectionMarkup = sectionLabels.length
        ? sectionLabels.map((label) => `<span>${escapeHtml(label)}</span>`)
          .join("")
        : "<span>Overview</span>";

      aside.innerHTML = `
              <div class="topic-aside-card">
                  <span class="eyebrow">${
        context.kind === "pillar" ? "Research Pillar" : "Topic Program"
      }</span>
                  <div class="topic-aside-hierarchy">${hierarchyMarkup}</div>
                  <p class="small-text">${escapeHtml(intro || topicTitle)}</p>
              </div>
              <div class="topic-aside-card">
                  <span class="eyebrow">Sections</span>
                  <div class="topic-aside-tags">${sectionMarkup}</div>
              </div>
              <a class="topic-back-link page-back-link" href="${context.backHref}">
                  <span class="page-back-link-icon" aria-hidden="true">←</span>
                  <span>${escapeHtml(context.backLabel)}</span>
              </a>
          `;
    }

    layout.innerHTML = "";
    layout.classList.add("topic-layout-grid");
    layout.append(main, aside);
    layout.dataset.topicLayoutEnhanced = "true";
  });
}

function scoreSearchResult(entry, query) {
  const phrase = normalizeSearchValue(query);
  const tokens = getSearchTokens(query);
  if (!phrase && !tokens.length) return -1;

  const phraseMatch = phrase ? entry._searchBlob.includes(phrase) : false;
  let tokenMatches = 0;
  let score = 0;

  tokens.forEach((token) => {
    const inEntry = entry._tokenSet.has(token) ||
      entry._searchBlob.includes(token);
    if (!inEntry) return;
    tokenMatches += 1;
    score += 2;
    if (entry._titleBlob.includes(token)) score += 4;
    if (entry._topicBlob.includes(token)) score += 2.5;
    if (entry._keywordBlob.includes(token)) score += 2;
    if (entry._typeBlob.includes(token)) score += 1;
  });

  if (phraseMatch) {
    score += 6;
    if (entry._titleBlob.includes(phrase)) score += 6;
    if (entry._topicBlob.includes(phrase)) score += 4;
    if (entry._keywordBlob.includes(phrase)) score += 3;
  }

  if (!phraseMatch && tokenMatches === 0) return -1;
  if (!phraseMatch && tokens.length >= 3 && tokenMatches < 2) return -1;

  if (tokens.length) {
    score += (tokenMatches / tokens.length) * 4;
  }

  return score;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getHighlightTerms(query) {
  const phrase = normalizeSearchValue(query);
  const terms = phrase
    ? [phrase, ...getSearchTokens(query)]
    : getSearchTokens(query);
  return [...new Set(terms.filter((term) => term.length > 1))]
    .sort((a, b) => b.length - a.length);
}

function highlightText(value, query) {
  const terms = getHighlightTerms(query);
  if (!terms.length) return escapeHtml(value);

  const termSet = new Set(terms);
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "ig");

  return String(value)
    .split(pattern)
    .map((part) => {
      const normalized = normalizeSearchValue(part);
      if (normalized && termSet.has(normalized)) {
        return `<mark>${escapeHtml(part)}</mark>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

function getSearchResultsMarkup(results, query) {
  if (!query.trim()) {
    return '<p class="small-text">Start typing to search the site.</p>';
  }

  if (!results.length) {
    return `
            <div class="search-empty-state">
                <p>No results for <strong>${
      escapeHtml(query.trim())
    }</strong>.</p>
                <p class="small-text">Try fewer words, or search by pillar, topic, or method name.</p>
            </div>
        `.trim();
  }

  const summary = `
        <div class="search-results-summary">
            <span>${results.length} result${
    results.length === 1 ? "" : "s"
  } for</span>
            <strong>${escapeHtml(query.trim())}</strong>
        </div>
    `.trim();

  const items = results.map((entry) => `
        <a href="${entry.url}" class="note-item" data-note-kind="${
    entry.type === "Topic" || entry.type === "Pillar" ? "program" : "article"
  }">
            <div class="content-meta taxonomy-refined">
                ${
    entry.pillar
      ? `<span class="meta-hierarchy">${
        formatHierarchyContent(`${entry.pillar} / ${entry.topic}`)
      }</span>`
      : `<span class="meta-focus">${escapeHtml(entry.topic)}</span>`
  }
                <span class="meta-type">${escapeHtml(entry.type)}</span>
            </div>
            <h3>${highlightText(entry.title, query)}</h3>
            <p>${highlightText(entry.excerpt, query)}</p>
        </a>
    `).join("");

  return `${summary}${items}`;
}

function renderSearchResults(results, query, containerId = "searchResults") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = getSearchResultsMarkup(results, query);
  enhanceTaxonomyMarkup(container);
  enhanceNoteItems(container);
}

function getRankedSearchResults(index, query) {
  return index
    .map((entry) => ({ entry, score: scoreSearchResult(entry, query) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) =>
      b.score - a.score || a.entry.title.localeCompare(b.entry.title)
    )
    .slice(0, 18)
    .map((item) => item.entry);
}

async function initializeSearchPage() {
  const input = document.getElementById("siteSearchInput");
  if (!input) return;

  try {
    const index = await loadSearchIndex();
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    if (!input.value) input.value = initialQuery;

    const runSearch = () => {
      const query = input.value;
      const results = getRankedSearchResults(index, query);
      renderSearchResults(results, query);
      const nextUrl = query.trim()
        ? `/search.html?q=${encodeURIComponent(query.trim())}`
        : "/search.html";
      window.history.replaceState(null, "", nextUrl);
    };

    input.addEventListener("input", runSearch);
    runSearch();
  } catch (error) {
    console.error(error);
    const container = document.getElementById("searchResults");
    if (container) {
      container.innerHTML =
        '<p class="small-text">Search index could not be loaded.</p>';
    }
  }
}

function initializeCoreAreasToggle() {
  const button = document.getElementById("coreAreasToggle");
  const panel = document.getElementById("coreAreasPanel");
  if (!button || !panel) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const nextState = !expanded;
    button.setAttribute("aria-expanded", String(nextState));
    panel.hidden = !nextState;
    if (nextState) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function initializeMobileSearchToggle() {
  const button = document.getElementById("mobileSearchToggle");
  if (!button) return;
  button.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "true");
    openSearchOverlay(button.dataset.initialQuery || "");
  });
}

function initializeSearchShortcut() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isShortcut = (event.metaKey || event.ctrlKey) && key === "k";
    if (!isShortcut) return;
    event.preventDefault();
    openSearchOverlay(document.getElementById("siteSearchInput")?.value || "");
  });
}

async function openSearchOverlay(initialQuery = "") {
  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchOverlayInput");
  if (!overlay || !input) return;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  input.value = initialQuery;
  input.focus();
  input.select();

  try {
    const index = await loadSearchIndex();
    const results = getRankedSearchResults(index, initialQuery);
    renderSearchResults(results, initialQuery, "searchOverlayResults");
  } catch (error) {
    const container = document.getElementById("searchOverlayResults");
    if (container) {
      container.innerHTML =
        '<p class="small-text">Search index could not be loaded.</p>';
    }
  }
}

function closeSearchOverlay() {
  const overlay = document.getElementById("searchOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("mobileSearchToggle")?.setAttribute(
    "aria-expanded",
    "false",
  );
}

async function initializeSearchOverlay() {
  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchOverlayInput");
  const close = document.getElementById("searchOverlayClose");
  const triggers = Array.from(
    document.querySelectorAll("[data-search-trigger='true']"),
  );
  if (!overlay || !input || !close) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      () => openSearchOverlay(trigger.dataset.initialQuery || ""),
    );
  });

  close.addEventListener("click", closeSearchOverlay);

  try {
    const index = await loadSearchIndex();
    const runOverlaySearch = () => {
      const query = input.value;
      const results = getRankedSearchResults(index, query);
      renderSearchResults(results, query, "searchOverlayResults");
    };
    input.addEventListener("input", runOverlaySearch);
    runOverlaySearch();
  } catch (error) {
    const container = document.getElementById("searchOverlayResults");
    if (container) {
      container.innerHTML =
        '<p class="small-text">Search index could not be loaded.</p>';
    }
  }
}

function initializeFeaturedSlider() {
  const slider = document.querySelector("[data-featured-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-featured-track]");
  const slides = Array.from(slider.querySelectorAll("[data-featured-slide]"));
  const prevButton = slider.querySelector("[data-featured-prev]");
  const nextButton = slider.querySelector("[data-featured-next]");
  const dots = Array.from(slider.querySelectorAll("[data-featured-dot]"));
  if (!track || !prevButton || !nextButton || !slides.length) return;

  let currentIndex = 0;
  let autoAdvanceId = null;
  slider.tabIndex = 0;

  let status = slider.querySelector("[data-featured-status]");
  if (!status) {
    status = document.createElement("p");
    status.className = "sr-only";
    status.setAttribute("data-featured-status", "true");
    status.setAttribute("aria-live", "polite");
    slider.appendChild(status);
  }

  const render = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
    const heading = slides[currentIndex]?.querySelector("h3")?.textContent
      ?.trim();
    if (heading) {
      status.textContent = `Featured article ${
        currentIndex + 1
      } of ${slides.length}: ${heading}`;
    }
  };

  const goTo = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;
    render();
  };

  const restartAutoAdvance = () => {
    if (autoAdvanceId) window.clearInterval(autoAdvanceId);
    if (slides.length <= 1) return;
    autoAdvanceId = window.setInterval(() => goTo(currentIndex + 1), 5500);
  };

  prevButton.addEventListener("click", () => {
    goTo(currentIndex - 1);
    restartAutoAdvance();
  });

  nextButton.addEventListener("click", () => {
    goTo(currentIndex + 1);
    restartAutoAdvance();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
      restartAutoAdvance();
    });
  });

  slider.addEventListener("mouseenter", () => {
    if (autoAdvanceId) window.clearInterval(autoAdvanceId);
  });
  slider.addEventListener("mouseleave", restartAutoAdvance);
  slider.addEventListener("focusin", () => {
    if (autoAdvanceId) window.clearInterval(autoAdvanceId);
  });
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) restartAutoAdvance();
  });
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
      restartAutoAdvance();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
      restartAutoAdvance();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (autoAdvanceId) window.clearInterval(autoAdvanceId);
      return;
    }
    restartAutoAdvance();
  });

  render();
  restartAutoAdvance();
}

function applyImageLoadingHints(root = document) {
  const featuredImages = Array.from(
    root.querySelectorAll(".featured-slide-media img"),
  );
  featuredImages.forEach((img, index) => {
    img.decoding = "async";
    if (
      index === 0 && normalizePath(window.location.pathname) === "/index.html"
    ) {
      img.loading = "eager";
      img.fetchPriority = "high";
    } else {
      if (!img.hasAttribute("loading")) img.loading = "lazy";
      if (!img.hasAttribute("fetchpriority")) img.fetchPriority = "low";
    }
  });

  root.querySelectorAll("img").forEach((img) => {
    if (!img.getAttribute("decoding")) img.decoding = "async";

    const keepEager = img.closest(".logo") ||
      img.classList.contains("hero-logo") ||
      Boolean(img.closest(".home-hero"));

    if (
      !img.hasAttribute("loading") && !keepEager &&
      !img.closest(".featured-slide-media")
    ) {
      img.loading = "lazy";
    }

    if (
      !img.hasAttribute("fetchpriority") && !keepEager &&
      !img.closest(".featured-slide-media")
    ) {
      img.fetchPriority = "low";
    }
  });
}

document.addEventListener("click", (event) => {
  const panel = document.getElementById("navLinks");
  const toggle = document.getElementById("menuToggle");
  if (
    panel && toggle && !panel.contains(event.target) &&
    !toggle.contains(event.target)
  ) {
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  const overlay = document.getElementById("searchOverlay");
  const overlayPanel = overlay?.querySelector(".search-overlay-panel");
  if (
    overlay?.classList.contains("open") && overlayPanel &&
    event.target === overlay
  ) {
    closeSearchOverlay();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSearchOverlay();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
  buildSearchOverlay();
  initializeFooter();
  ensureThemeToggle();
  applyTheme(getPreferredTheme());
  enhanceTaxonomyMarkup();
  enhanceNoteItems();
  enhanceTopicLayouts();
  applyImageLoadingHints();
  initializeCoreAreasToggle();
  initializeMobileSearchToggle();
  initializeSearchOverlay();
  initializeSearchShortcut();
  initializeSearchPage();
  initializeFeaturedSlider();
});
