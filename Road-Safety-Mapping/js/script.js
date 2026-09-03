/**
 * ROAD SAFETY MAPPING AROUND SCHOOLS - CORE JAVASCRIPT
 * University of Mumbai - B.Sc. Computer Science Semester V CEP
 * Shared utilities: Theme Switcher, Mobile Navigation, Data Loaders, Toast System
 */

// ==========================================================================
// 1. THEME ENGINE (Light Mode / Dark Mode)
// ==========================================================================
const THEME_STORAGE_KEY = "cep_road_safety_theme";

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? "dark" : "light");

  applyTheme(currentTheme);

  // Bind toggle buttons
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(active);
      localStorage.setItem(THEME_STORAGE_KEY, active);
      showToast(`Switched to ${active.toUpperCase()} mode`, "info", 2000);
    });
  });

  // Listen to OS-level theme changes if no manual preference is stored
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  themeToggleBtns.forEach(btn => {
    btn.innerHTML = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`);
    btn.setAttribute("title", `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`);
  });

  // Dispatch custom event for Leaflet and Chart.js to react immediately
  window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
}

// ==========================================================================
// 2. MOBILE NAVIGATION & ACTIVE LINK HIGHLIGHTING
// ==========================================================================
function initNavigation() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const drawer = document.querySelector(".mobile-nav-drawer");

  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      drawer.classList.toggle("open");
      const isOpen = drawer.classList.contains("open");
      menuBtn.setAttribute("aria-expanded", isOpen);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
        drawer.classList.remove("open");
      }
    });
  }

  // Highlight active link based on current page URL
  highlightActiveNav();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const filename = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  const allNavLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  allNavLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFilename = href.substring(href.lastIndexOf("/") + 1) || "index.html";
    if (filename === linkFilename || (filename === "" && linkFilename === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ==========================================================================
// 3. REUSABLE DATA LOADERS (Risk Data & Survey Data)
// ==========================================================================

/**
 * Loads risk data from data/risk-data.json with error fallback
 */
async function loadRiskData() {
  try {
    const res = await fetch("data/risk-data.json");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Failed to fetch data/risk-data.json, using fallback data:", err);
    return getFallbackRiskData();
  }
}

/**
 * Loads survey responses from data/survey-data.json merged with localStorage submissions
 */
async function loadSurveyData() {
  let baselineResponses = [];
  try {
    const res = await fetch("data/survey-data.json");
    if (res.ok) {
      const data = await res.json();
      baselineResponses = data.responses || [];
    }
  } catch (err) {
    console.warn("Could not fetch data/survey-data.json, relying on local data:", err);
  }

  // Retrieve user submitted survey responses from localStorage
  const localStored = localStorage.getItem("cep_survey_responses");
  let userResponses = [];
  if (localStored) {
    try {
      userResponses = JSON.parse(localStored);
    } catch (e) {
      console.error("Error parsing local survey data:", e);
    }
  }

  // Combined dataset with user submissions on top
  return [...userResponses, ...baselineResponses];
}

// ==========================================================================
// 4. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message, type = "info", duration = 3500) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = {
    success: "✅",
    danger: "⚠️",
    warning: "⚡",
    info: "ℹ️"
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || "ℹ️"}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// ==========================================================================
// 5. ANIMATED NUMERIC COUNTERS
// ==========================================================================
function animateCounter(element, targetValue, duration = 1200) {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out expo
    const current = Math.floor(progress === 1 ? targetValue : targetValue * (1 - Math.pow(2, -10 * progress)));
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetValue;
    }
  }

  requestAnimationFrame(update);
}

// ==========================================================================
// 6. HELPER FORMATTING FUNCTIONS
// ==========================================================================
function getRiskBadgeHtml(riskLevel) {
  const level = (riskLevel || "").toLowerCase();
  if (level === "high") {
    return `<span class="badge badge-high">🔴 High Risk</span>`;
  } else if (level === "medium" || level === "med") {
    return `<span class="badge badge-med">🟠 Medium Risk</span>`;
  } else if (level === "low") {
    return `<span class="badge badge-low">🟢 Low Risk</span>`;
  }
  return `<span class="badge badge-neutral">ℹ️ ${escapeHtml(riskLevel)}</span>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Fallback risk data if server/fetch is inaccessible
function getFallbackRiskData() {
  return {
    school: {
      name: "St. Jude Model High School",
      zone: "Vile Parle West, Mumbai",
      latitude: 19.1028,
      longitude: 72.8430
    },
    riskLocations: [
      {
        id: "R01",
        name: "School Main Gate & Entry Plaza",
        latitude: 19.1028,
        longitude: 72.8430,
        riskLevel: "High",
        problem: "Chaotic double parking and pedestrian crowding during afternoon dismissal.",
        observation: "Vehicles idling directly at gate; children weaving in traffic.",
        recommendation: "Construct 50m drop-off bay & raised tabletop pedestrian crossing.",
        photo: "assets/images/risk-r01.svg"
      }
    ]
  };
}

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
});
