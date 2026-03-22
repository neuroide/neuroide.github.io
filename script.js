const THEME_KEY = "neuroide-theme";
let cachedSearchIndex = null;

const NAV_ITEMS = [
    { href: "/index.html", label: "Home", key: "home" },
    { href: "/topics/signals/index.html", label: "Signals", key: "signals" },
    { href: "/topics/ml/index.html", label: "ML", key: "ml" },
    { href: "/topics/genai/index.html", label: "GenAI", key: "genai" },
    { href: "/topics/robotics/index.html", label: "Robotics", key: "robotics" },
    { href: "/about.html", label: "About", key: "about" }
];

const SOCIAL_LINKS = {
    github: "https://github.com/neuroide",
    youtube: "https://youtube.com/neuroide",
    linkedin: "https://www.linkedin.com/in/neuroide/",
    x: "https://x.com/neuroide_"
};

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

function getActiveNavKey(pathname) {
    const normalized = normalizePath(pathname);
    if (normalized === "/about.html") return "about";
    if (normalized === "/search.html") return "search";
    if (normalized.startsWith("/topics/signals/")) return "signals";
    if (normalized.startsWith("/topics/ml/")) return "ml";
    if (normalized.startsWith("/topics/genai/")) return "genai";
    if (normalized.startsWith("/topics/robotics/")) return "robotics";
    return "home";
}

function buildNavList(activeKey, includeSearch) {
    const items = [...NAV_ITEMS];
    if (includeSearch) {
        items.splice(items.length - 1, 0, {
            href: "/search.html",
            label: "Search",
            key: "search",
            isSearch: true
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
        <form class="${className}" action="/search.html" method="get" role="search">
            <label class="sr-only" for="${className.replace(/\s+/g, "-")}-input">Search Neuroide</label>
            <span class="site-search-icon" aria-hidden="true"></span>
            <input id="${className.replace(/\s+/g, "-")}-input" class="site-search-input" type="search" name="q" value="${safeQuery}" placeholder="Search articles, topics, and notes">
        </form>
    `;
}

function buildMobileSearchPanel(currentQuery = "") {
    return `
        <div class="mobile-search-shell">
            <button id="mobileSearchToggle" class="mobile-search-toggle" type="button" aria-expanded="false" aria-controls="mobileSearchForm">
                <span class="site-search-icon mobile-search-toggle-icon" aria-hidden="true"></span>
            </button>
            <div id="mobileSearchForm" class="mobile-search-panel">
                ${buildSearchForm("site-search-form mobile-search", currentQuery)}
            </div>
        </div>
    `;
}

function initializeHeader() {
    const nav = document.querySelector("header nav");
    if (!nav) return;

    const activeKey = getActiveNavKey(window.location.pathname);
    const currentQuery = new URLSearchParams(window.location.search).get("q") || "";

    nav.innerHTML = `
        <a href="/index.html" class="logo" aria-label="Neuroide home">
            <img src="/images/neuroide.png" alt="Neuroide">
        </a>
        ${buildSearchForm("site-search-form desktop-search", currentQuery)}
        <div class="nav-primary">
            <ul class="nav-links">
                ${buildNavList(activeKey, false)}
            </ul>
        </div>
        <div class="nav-utilities">
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

    footer.innerHTML = `
        <div class="container footer-grid">
            <div>&copy; 2026 Neuroide. All rights reserved.</div>
            <div class="footer-social" aria-label="Social media links">
                <a class="social-link" href="${SOCIAL_LINKS.github}" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.57 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/></svg>
                </a>
                <a class="social-link" href="${SOCIAL_LINKS.youtube}" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.39.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.87.58 9.39.58 9.39.58s7.52 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.3 3.7-6.3 3.7Z"/></svg>
                </a>
                <a class="social-link" href="${SOCIAL_LINKS.linkedin}" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A1.98 1.98 0 1 0 5 7.46a1.98 1.98 0 0 0-.02-3.96ZM3.5 8.75h3V20.5h-3V8.75Zm5.5 0h2.88v1.6h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.59 2 3.59 4.59v7.12h-3v-6.31c0-1.5-.03-3.43-2.09-3.43-2.1 0-2.42 1.64-2.42 3.32v6.42H9V8.75Z"/></svg>
                </a>
                <a class="social-link" href="${SOCIAL_LINKS.x}" aria-label="Twitter or X">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.88-6.97L5.98 22H2.87l7.24-8.27L.5 2h6.4l4.4 6.3L18.9 2Zm-1.1 18h1.72L5.97 3.9H4.12L17.8 20Z"/></svg>
                </a>
            </div>
        </div>
    `;
}

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.innerHTML = theme === "dark"
            ? '<span aria-hidden="true">☀</span>'
            : '<span aria-hidden="true">☾</span>';
        toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
        toggle.setAttribute("title", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
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
        const current = document.documentElement.getAttribute("data-theme") || "light";
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
    cachedSearchIndex = await response.json();
    return cachedSearchIndex;
}

function scoreSearchResult(entry, query) {
    const haystack = `${entry.title} ${entry.topic} ${entry.type} ${entry.excerpt} ${entry.keywords}`.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q || !haystack.includes(q)) return -1;
    let score = 1;
    if (entry.title.toLowerCase().includes(q)) score += 5;
    if (entry.topic.toLowerCase().includes(q)) score += 2;
    if ((entry.keywords || "").toLowerCase().includes(q)) score += 2;
    return score;
}

function renderSearchResults(results, query) {
    const container = document.getElementById("searchResults");
    if (!container) return;

    if (!query.trim()) {
        container.innerHTML = "<p class=\"small-text\">Start typing to search the site.</p>";
        return;
    }

    if (!results.length) {
        container.innerHTML = "<p class=\"small-text\">No results found.</p>";
        return;
    }

    container.innerHTML = results.map((entry) => `
        <a href="${entry.url}" class="note-item">
            <div class="content-meta">
                <span>${entry.topic}</span>
                <span>${entry.type}</span>
            </div>
            <h3>${entry.title}</h3>
            <p>${entry.excerpt}</p>
        </a>
    `).join("");
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
            const results = index
                .map((entry) => ({ entry, score: scoreSearchResult(entry, query) }))
                .filter((item) => item.score >= 0)
                .sort((a, b) => b.score - a.score)
                .map((item) => item.entry);
            renderSearchResults(results, query);

            const nextUrl = query.trim() ? `/search.html?q=${encodeURIComponent(query.trim())}` : "/search.html";
            window.history.replaceState(null, "", nextUrl);
        };

        input.addEventListener("input", runSearch);
        runSearch();
    } catch (error) {
        console.error(error);
        const container = document.getElementById("searchResults");
        if (container) {
            container.innerHTML = "<p class=\"small-text\">Search index could not be loaded.</p>";
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
    const panel = document.getElementById("mobileSearchForm");
    const shell = document.querySelector(".mobile-search-shell");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        const nextState = !expanded;
        button.setAttribute("aria-expanded", String(nextState));
        if (shell) shell.classList.toggle("open", nextState);

        if (nextState) {
            const input = panel.querySelector(".site-search-input");
            if (input) input.focus();
        }
    });
}

document.addEventListener("click", (event) => {
    const panel = document.getElementById("navLinks");
    const toggle = document.getElementById("menuToggle");
    const searchShell = document.querySelector(".mobile-search-shell");
    if (!panel || !toggle) return;
    if (!panel.contains(event.target) && !toggle.contains(event.target)) {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }
    const searchButton = document.getElementById("mobileSearchToggle");
    const searchPanel = document.getElementById("mobileSearchForm");
    if (searchShell && searchButton && searchPanel && !searchShell.contains(event.target)) {
        searchButton.setAttribute("aria-expanded", "false");
        searchShell.classList.remove("open");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    initializeHeader();
    initializeFooter();
    ensureThemeToggle();
    applyTheme(getPreferredTheme());
    initializeCoreAreasToggle();
    initializeMobileSearchToggle();
    initializeSearchPage();
});
