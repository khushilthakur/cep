/**
 * ROAD SAFETY MAPPING AROUND SCHOOLS - CHART.JS ANALYTICS ENGINE
 * University of Mumbai - B.Sc. Computer Science Semester V CEP
 * Dynamic data aggregation, automatic percentages, dual-theme color adaptability
 */

let chartInstances = {};

/**
 * Initialize charts on DOM ready
 */
async function initResultsDashboard() {
  const chartCanvasElements = document.querySelectorAll("canvas[data-chart]");
  if (chartCanvasElements.length === 0) return;

  const responses = await loadSurveyData();
  if (!responses || responses.length === 0) {
    showEmptyChartState();
    return;
  }

  // 1. Calculate & Render Summary Statistics
  updateSurveySummaryMetrics(responses);

  // 2. Render all 4 Charts
  renderTransportModeChart(responses);
  renderSafetyRatingChart(responses);
  renderHazardFrequencyChart(responses);
  renderTravelTimeChart(responses);

  // 3. Render Aggregate Table if present
  renderAggregateDataTable(responses);

  // 4. Listen to Theme Changes for instant chart theme recalculation
  window.addEventListener("themeChanged", (e) => {
    updateChartThemes(e.detail.theme);
  });
}

/**
 * Compute key percentages dynamically from survey records
 */
function updateSurveySummaryMetrics(responses) {
  const total = responses.length;
  if (total === 0) return;

  // Total responses
  const totalEl = document.getElementById("metric-total-responses");
  if (totalEl) totalEl.textContent = total;

  // Unsafe Perception (% Unsafe + Very Unsafe)
  const unsafeCount = responses.filter(r => r.safetyRating === "Unsafe" || r.safetyRating === "Very Unsafe").length;
  const unsafePct = Math.round((unsafeCount / total) * 100);
  const unsafeEl = document.getElementById("metric-unsafe-pct");
  if (unsafeEl) unsafeEl.textContent = `${unsafePct}%`;

  // Heavy Traffic (% Yes - Very Heavy)
  const trafficCount = responses.filter(r => (r.heavyTraffic || "").includes("Very Heavy")).length;
  const trafficPct = Math.round((trafficCount / total) * 100);
  const trafficEl = document.getElementById("metric-traffic-pct");
  if (trafficEl) trafficEl.textContent = `${trafficPct}%`;

  // Improper Parking (% Major Issue)
  const parkingCount = responses.filter(r => (r.improperParking || "").includes("Major")).length;
  const parkingPct = Math.round((parkingCount / total) * 100);
  const parkingEl = document.getElementById("metric-parking-pct");
  if (parkingEl) parkingEl.textContent = `${parkingPct}%`;

  // Speeding Concern (% Frequently Observed)
  const speedingCount = responses.filter(r => (r.vehicleSpeeding || "").includes("Frequently")).length;
  const speedingPct = Math.round((speedingCount / total) * 100);
  const speedingEl = document.getElementById("metric-speeding-pct");
  if (speedingEl) speedingEl.textContent = `${speedingPct}%`;

  // Footpath Deficit (% Partial/Broken + No Footpaths)
  const footpathCount = responses.filter(r => (r.sufficientFootpath || "").includes("No") || (r.sufficientFootpath || "").includes("Broken")).length;
  const footpathPct = Math.round((footpathCount / total) * 100);
  const footpathEl = document.getElementById("metric-footpath-pct");
  if (footpathEl) footpathEl.textContent = `${footpathPct}%`;
}

/**
 * Returns theme-appropriate color tokens for Chart.js
 */
function getChartThemeColors() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    isDark,
    textColor: isDark ? "#f1f5f9" : "#1e293b",
    mutedColor: isDark ? "#94a3b8" : "#64748b",
    gridColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipTitle: isDark ? "#f8fafc" : "#0f172a",
    tooltipBody: isDark ? "#cbd5e1" : "#334155",
    tooltipBorder: isDark ? "#374151" : "#e2e8f0"
  };
}

/**
 * Chart 1: Transport Mode Distribution (Doughnut Chart)
 */
function renderTransportModeChart(responses) {
  const ctx = document.getElementById("chart-transport-mode");
  if (!ctx) return;

  const modeCounts = {};
  responses.forEach(r => {
    const mode = r.transportMode || "Other";
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  const labels = Object.keys(modeCounts);
  const data = Object.values(modeCounts);
  const colors = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];

  const themeColors = getChartThemeColors();

  if (chartInstances.transport) chartInstances.transport.destroy();

  chartInstances.transport = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: themeColors.isDark ? "#111827" : "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: themeColors.textColor,
            font: { family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              const count = item.raw;
              const pct = Math.round((count / responses.length) * 100);
              return ` ${item.label}: ${count} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Chart 2: Safety Perception Rating (Bar Chart)
 */
function renderSafetyRatingChart(responses) {
  const ctx = document.getElementById("chart-safety-rating");
  if (!ctx) return;

  const order = ["Very Safe", "Safe", "Neutral", "Unsafe", "Very Unsafe"];
  const counts = { "Very Safe": 0, "Safe": 0, "Neutral": 0, "Unsafe": 0, "Very Unsafe": 0 };

  responses.forEach(r => {
    if (counts[r.safetyRating] !== undefined) {
      counts[r.safetyRating]++;
    }
  });

  const themeColors = getChartThemeColors();
  const barColors = ["#16a34a", "#22c55e", "#f59e0b", "#ea580c", "#dc2626"];

  if (chartInstances.safety) chartInstances.safety.destroy();

  chartInstances.safety = new Chart(ctx, {
    type: "bar",
    data: {
      labels: order,
      datasets: [{
        label: "Respondents Count",
        data: order.map(k => counts[k]),
        backgroundColor: barColors,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const val = item.raw;
              const pct = Math.round((val / responses.length) * 100);
              return ` ${val} Respondents (${pct}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: themeColors.gridColor },
          ticks: { color: themeColors.textColor }
        },
        y: {
          beginAtZero: true,
          grid: { color: themeColors.gridColor },
          ticks: { color: themeColors.textColor, stepSize: 5 }
        }
      }
    }
  });
}

/**
 * Chart 3: Key Safety Concerns / Infrastructure Violations (Horizontal Bar)
 */
function renderHazardFrequencyChart(responses) {
  const ctx = document.getElementById("chart-hazard-concerns");
  if (!ctx) return;

  const total = responses.length;
  const metrics = [
    { label: "Frequent Vehicle Speeding", count: responses.filter(r => (r.vehicleSpeeding || "").includes("Frequently")).length },
    { label: "Chaotic / Illegal Parking", count: responses.filter(r => (r.improperParking || "").includes("Major")).length },
    { label: "Missing / Difficult Road Crossing", count: responses.filter(r => r.easyToCross === "No").length },
    { label: "Broken / Obstructed Footpath", count: responses.filter(r => (r.sufficientFootpath || "").includes("No") || (r.sufficientFootpath || "").includes("Broken")).length },
    { label: "Missing School Zone Signs", count: responses.filter(r => (r.visibleSignage || "").includes("None") || (r.visibleSignage || "").includes("Missing")).length },
    { label: "Experienced Road Hazard", count: responses.filter(r => r.experiencedHazard === "Yes").length }
  ];

  const themeColors = getChartThemeColors();

  if (chartInstances.hazards) chartInstances.hazards.destroy();

  chartInstances.hazards = new Chart(ctx, {
    type: "bar",
    indexAxis: "y",
    data: {
      labels: metrics.map(m => m.label),
      datasets: [{
        label: "% Reporting Issue",
        data: metrics.map(m => Math.round((m.count / total) * 100)),
        backgroundColor: "#2563eb",
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% of all surveyed participants`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: { color: themeColors.gridColor },
          ticks: {
            color: themeColors.textColor,
            callback: (v) => `${v}%`
          }
        },
        y: {
          grid: { color: themeColors.gridColor },
          ticks: { color: themeColors.textColor, font: { size: 11 } }
        }
      }
    }
  });
}

/**
 * Chart 4: Commute Travel Time Distribution (Bar Chart)
 */
function renderTravelTimeChart(responses) {
  const ctx = document.getElementById("chart-travel-time");
  if (!ctx) return;

  const durations = ["Under 10 mins", "10-20 mins", "20-30 mins", "Over 30 mins"];
  const counts = { "Under 10 mins": 0, "10-20 mins": 0, "20-30 mins": 0, "Over 30 mins": 0 };

  responses.forEach(r => {
    if (counts[r.travelTime] !== undefined) {
      counts[r.travelTime]++;
    }
  });

  const themeColors = getChartThemeColors();

  if (chartInstances.travelTime) chartInstances.travelTime.destroy();

  chartInstances.travelTime = new Chart(ctx, {
    type: "bar",
    data: {
      labels: durations,
      datasets: [{
        label: "Students / Parents",
        data: durations.map(d => counts[d]),
        backgroundColor: "#0284c7",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: themeColors.gridColor },
          ticks: { color: themeColors.textColor }
        },
        y: {
          beginAtZero: true,
          grid: { color: themeColors.gridColor },
          ticks: { color: themeColors.textColor }
        }
      }
    }
  });
}

/**
 * Populates dynamic survey data table on results.html
 */
function renderAggregateDataTable(responses) {
  const tbody = document.getElementById("survey-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  // Show latest 15 records in reverse chronological order
  const displayList = [...responses].reverse().slice(0, 15);

  displayList.forEach((r, idx) => {
    const tr = document.createElement("tr");
    const riskBadge = r.safetyRating === "Very Unsafe" || r.safetyRating === "Unsafe"
      ? `<span class="badge badge-high">${r.safetyRating}</span>`
      : (r.safetyRating === "Neutral" ? `<span class="badge badge-med">${r.safetyRating}</span>` : `<span class="badge badge-low">${r.safetyRating}</span>`);

    tr.innerHTML = `
      <td><strong>#${responses.length - idx}</strong></td>
      <td>${escapeHtml(r.respondentCategory || "Participant")}</td>
      <td>${escapeHtml(r.transportMode || "Walking")}</td>
      <td>${escapeHtml(r.travelTime || "-")}</td>
      <td>${riskBadge}</td>
      <td>${escapeHtml(r.dangerousSpot || "Near School Gate")}</td>
      <td style="max-width: 260px; font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(r.recommendationText || "-")}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Smoothly updates all chart instances when theme switches
 */
function updateChartThemes(newTheme) {
  const isDark = newTheme === "dark";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  Object.values(chartInstances).forEach(chart => {
    if (!chart) return;
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.x.grid.color = gridColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.ticks.color = textColor;
        chart.options.scales.y.grid.color = gridColor;
      }
    }
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    chart.update();
  });
}

function showEmptyChartState() {
  const containers = document.querySelectorAll(".chart-canvas-container");
  containers.forEach(c => {
    c.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);">No survey data available to generate charts.</div>`;
  });
}

// Auto-run on DOM ready if canvas elements exist
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll("canvas[data-chart]").length > 0) {
    initResultsDashboard();
  }
});
