/**
 * ROAD SAFETY MAPPING AROUND SCHOOLS - LEAFLET MAP MODULE
 * University of Mumbai - B.Sc. Computer Science Semester V CEP
 * Interactive GIS mapping, dynamic risk filtering, custom SVG pins & dual-theme tile layers
 */

let safetyMap = null;
let tileLayer = null;
let markersLayer = null;
let schoolCircle = null;
let mapData = null;
const markerRegistry = {}; // id -> Leaflet marker

// Tile layer URL definitions
const TILE_URLS = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Initialize the Leaflet Map
 */
async function initSafetyMap() {
  const mapContainer = document.getElementById("safety-map");
  if (!mapContainer) return;

  try {
    // 1. Load Risk Data
    mapData = await loadRiskData();
    if (!mapData || !mapData.school) {
      throw new Error("Invalid risk data structure");
    }

    const school = mapData.school;
    const initialCoords = [school.latitude, school.longitude];

    // 2. Create Leaflet Map Instance
    safetyMap = L.map("safety-map", {
      center: initialCoords,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false // Prevent accidental scroll trapping on mobile
    });

    // 3. Add Tile Layer according to current theme
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setMapTileLayer(currentTheme);

    // 4. Feature Group for Risk Markers
    markersLayer = L.featureGroup().addTo(safetyMap);

    // 5. Add School Marker & 500m Safety Buffer Zone
    renderSchoolMarker(school);

    // 6. Render All Risk Markers
    renderRiskMarkers(mapData.riskLocations || []);

    // 7. Setup Interactive Controls & Filters
    setupMapControls();

    // 8. Handle Deep-Link query parameter (e.g. map.html?risk=R02)
    handleUrlQueryParams();

    // 9. React to global theme change
    window.addEventListener("themeChanged", (e) => {
      setMapTileLayer(e.detail.theme);
    });

    // Invalidate map size after animation/load
    setTimeout(() => {
      safetyMap.invalidateSize();
    }, 250);

  } catch (err) {
    console.error("Map initialization failed:", err);
    mapContainer.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
        <h3>Map Load Error</h3>
        <p>Could not initialize OpenStreetMap layers. Please check network connectivity.</p>
        <p style="font-size:0.85rem;">${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

/**
 * Switch tile layer between light and dark modes
 */
function setMapTileLayer(theme) {
  if (!safetyMap) return;
  if (tileLayer) {
    safetyMap.removeLayer(tileLayer);
  }
  const url = theme === "dark" ? TILE_URLS.dark : TILE_URLS.light;
  tileLayer = L.tileLayer(url, {
    attribution: TILE_ATTRIBUTION,
    maxZoom: 19,
    subdomains: "abcd"
  }).addTo(safetyMap);
}

/**
 * Render the School marker with crest & 500m study radius
 */
function renderSchoolMarker(school) {
  const schoolIcon = L.divIcon({
    className: "custom-map-pin",
    html: `
      <div class="pin-bubble school" title="${escapeHtml(school.name)}">
        🏫
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22]
  });

  const marker = L.marker([school.latitude, school.longitude], {
    icon: schoolIcon,
    zIndexOffset: 1000
  }).addTo(safetyMap);

  const popupContent = `
    <div class="map-popup-card">
      <div class="map-popup-body">
        <div class="map-popup-header">
          <span class="badge badge-school">Selected School</span>
          <span style="font-size: 0.76rem; color: var(--text-subtle);">Study Hub</span>
        </div>
        <h4 class="map-popup-title">${escapeHtml(school.name)}</h4>
        <p class="map-popup-meta">📍 ${escapeHtml(school.zone || school.address)}</p>
        <div class="map-popup-recom" style="border-left-color: var(--primary);">
          <strong>CEP Field Study Area</strong>
          <div>Radius: ${school.studyRadiusMeters || 500} meters | Enrolment: ${school.studentCount || "1400+"} Students</div>
          <div>Morning Rush: ${escapeHtml(school.morningArrival || "07:15 - 08:00 AM")}</div>
          <div>Afternoon Dismissal: ${escapeHtml(school.afternoonDispersal || "01:15 - 02:15 PM")}</div>
        </div>
      </div>
    </div>
  `;

  marker.bindPopup(popupContent);

  // Add 500m buffer circle
  schoolCircle = L.circle([school.latitude, school.longitude], {
    radius: school.studyRadiusMeters || 500,
    color: "#2563eb",
    fillColor: "#3b82f6",
    fillOpacity: 0.08,
    weight: 1.5,
    dashArray: "6, 6"
  }).addTo(safetyMap);
}

/**
 * Render all risk points with custom color-coded pins
 */
function renderRiskMarkers(locations) {
  markersLayer.clearLayers();

  locations.forEach((loc) => {
    const riskClass = (loc.riskLevel || "").toLowerCase();
    const pinSymbol = riskClass === "high" ? "!" : (riskClass === "medium" || riskClass === "med" ? "▲" : "✓");

    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `
        <div class="pin-bubble ${riskClass}" title="${escapeHtml(loc.name)} (${loc.riskLevel} Risk)">
          ${pinSymbol}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

    const badgeClass = riskClass === "high" ? "badge-high" : (riskClass === "medium" || riskClass === "med" ? "badge-med" : "badge-low");
    const photoSrc = loc.photo || "assets/images/risk-r01.svg";

    const popupHtml = `
      <div class="map-popup-card">
        <div class="map-popup-media">
          <img src="${photoSrc}" alt="${escapeHtml(loc.name)}" onerror="this.src='assets/images/hero-illustration.svg'" />
        </div>
        <div class="map-popup-body">
          <div class="map-popup-header">
            <span class="badge ${badgeClass}">${escapeHtml(loc.riskLevel)} Risk</span>
            <span style="font-size: 0.74rem; font-weight: 700; color: var(--primary);">${escapeHtml(loc.id)}</span>
          </div>
          <h4 class="map-popup-title">${escapeHtml(loc.name)}</h4>
          <p class="map-popup-desc"><strong>Hazard:</strong> ${escapeHtml(loc.problem)}</p>
          <p class="map-popup-desc"><strong>Field Observation:</strong> ${escapeHtml(loc.observation)}</p>
          <div class="map-popup-recom">
            <strong>Action Recommendation:</strong>
            <div>${escapeHtml(loc.recommendation)}</div>
          </div>
        </div>
        <div class="map-popup-footer">
          <span style="font-size: 0.75rem; color: var(--text-subtle);">📅 ${escapeHtml(loc.date || "Field Visit")}</span>
          <a href="risk-areas.html#${loc.id}" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
            Full Report &rarr;
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 320 });
    marker.locData = loc;

    markersLayer.addLayer(marker);
    markerRegistry[loc.id] = marker;
  });
}

/**
 * Map Controls: Filter buttons, search bar, school focus
 */
function setupMapControls() {
  // Filter buttons
  const filterBtns = document.querySelectorAll(".map-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      applyRiskFilter(filter);
    });
  });

  // Focus School Button
  const focusSchoolBtn = document.getElementById("focus-school-btn");
  if (focusSchoolBtn && mapData && mapData.school) {
    focusSchoolBtn.addEventListener("click", () => {
      safetyMap.flyTo([mapData.school.latitude, mapData.school.longitude], 16, {
        duration: 1.2
      });
    });
  }

  // Reset Zoom / Fit All
  const fitAllBtn = document.getElementById("fit-all-btn");
  if (fitAllBtn && markersLayer) {
    fitAllBtn.addEventListener("click", () => {
      const bounds = markersLayer.getBounds();
      if (bounds.isValid()) {
        safetyMap.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }

  // Live Location Search
  const searchInput = document.getElementById("map-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterLocationsBySearch(query);
    });
  }
}

/**
 * Filter markers by Risk Level (all, high, medium, low)
 */
function applyRiskFilter(filter) {
  if (!mapData || !mapData.riskLocations) return;

  const filtered = mapData.riskLocations.filter(loc => {
    if (filter === "all") return true;
    return loc.riskLevel.toLowerCase() === filter.toLowerCase();
  });

  renderRiskMarkers(filtered);
}

/**
 * Filter markers by user search text
 */
function filterLocationsBySearch(query) {
  if (!mapData || !mapData.riskLocations) return;

  if (!query) {
    renderRiskMarkers(mapData.riskLocations);
    return;
  }

  const matched = mapData.riskLocations.filter(loc => {
    return (
      loc.name.toLowerCase().includes(query) ||
      loc.problem.toLowerCase().includes(query) ||
      loc.observation.toLowerCase().includes(query) ||
      loc.id.toLowerCase().includes(query)
    );
  });

  renderRiskMarkers(matched);

  // If exactly one match, pan to it
  if (matched.length === 1) {
    const singleLoc = matched[0];
    safetyMap.flyTo([singleLoc.latitude, singleLoc.longitude], 17, { duration: 1 });
    const targetMarker = markerRegistry[singleLoc.id];
    if (targetMarker) {
      setTimeout(() => targetMarker.openPopup(), 1100);
    }
  }
}

/**
 * Handle URL query parameter deep linking (e.g. map.html?risk=R02)
 */
function handleUrlQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const targetRiskId = params.get("risk");
  if (!targetRiskId) return;

  setTimeout(() => {
    const marker = markerRegistry[targetRiskId.toUpperCase()];
    if (marker && marker.locData) {
      safetyMap.flyTo([marker.locData.latitude, marker.locData.longitude], 17, {
        duration: 1.2
      });
      setTimeout(() => {
        marker.openPopup();
      }, 1300);
    }
  }, 400);
}

// Auto-run when map page is active
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("safety-map")) {
    initSafetyMap();
  }
});
