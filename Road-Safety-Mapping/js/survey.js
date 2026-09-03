/**
 * ROAD SAFETY MAPPING AROUND SCHOOLS - SURVEY CONTROLLER
 * University of Mumbai - B.Sc. Computer Science Semester V CEP
 * Client-side validation, localStorage persistence, JSON export, viva demonstration tools
 */

const LOCAL_SURVEY_KEY = "cep_survey_responses";

function initSurveyEngine() {
  const surveyForm = document.getElementById("community-survey-form");
  if (!surveyForm) return;

  // 1. Update response counter on page
  updateLocalSurveyCount();

  // 2. Handle Form Submit
  surveyForm.addEventListener("submit", handleSurveySubmit);

  // 3. Handle Reset Button
  const resetBtn = document.getElementById("survey-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your current answers?")) {
        surveyForm.reset();
        showToast("Survey form inputs cleared", "info");
      }
    });
  }

  // 4. Handle Export JSON button
  const exportBtn = document.getElementById("export-survey-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportSurveysAsJson);
  }

  // 5. Handle Clear Local Storage Data button
  const clearDataBtn = document.getElementById("clear-local-surveys-btn");
  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", () => {
      if (confirm("Clear all locally recorded survey submissions on this browser?")) {
        localStorage.removeItem(LOCAL_SURVEY_KEY);
        updateLocalSurveyCount();
        showToast("Local survey responses cleared", "warning");
      }
    });
  }
}

/**
 * Validates and records a new survey submission
 */
function handleSurveySubmit(e) {
  e.preventDefault();
  const form = e.target;

  // Extract Form Data
  const formData = new FormData(form);

  // Validate required radio groups
  const requiredRadios = [
    { name: "respondentCategory", label: "Respondent Category" },
    { name: "transportMode", label: "Primary Transport Mode" },
    { name: "travelTime", label: "Commute Travel Time" },
    { name: "safetyRating", label: "Perceived Safety Rating" },
    { name: "zebraCrossingPresent", label: "Zebra Crossing Presence" },
    { name: "easyToCross", label: "Ease of Road Crossing" },
    { name: "heavyTraffic", label: "Peak Hour Traffic Intensity" },
    { name: "vehicleSpeeding", label: "Vehicle Speeding Frequency" },
    { name: "improperParking", label: "Improper Parking Concern" },
    { name: "sufficientFootpath", label: "Pedestrian Footpath Adequacy" },
    { name: "visibleSignage", label: "Road Signage Visibility" },
    { name: "sufficientLighting", label: "Street Lighting Quality" },
    { name: "experiencedHazard", label: "Experienced Hazard near School" }
  ];

  for (const field of requiredRadios) {
    if (!formData.get(field.name)) {
      showToast(`Please answer question: "${field.label}"`, "danger");
      highlightQuestion(field.name);
      return;
    }
  }

  const dangerousSpot = (formData.get("dangerousSpot") || "").trim();
  if (!dangerousSpot) {
    showToast("Please specify the dangerous location or intersection", "danger");
    const input = form.querySelector('[name="dangerousSpot"]');
    if (input) {
      input.focus();
      input.style.borderColor = "var(--risk-high)";
    }
    return;
  }

  // Build Response Object
  const newResponse = {
    id: `LOCAL-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    respondentCategory: formData.get("respondentCategory"),
    transportMode: formData.get("transportMode"),
    travelTime: formData.get("travelTime"),
    safetyRating: formData.get("safetyRating"),
    zebraCrossingPresent: formData.get("zebraCrossingPresent"),
    easyToCross: formData.get("easyToCross"),
    heavyTraffic: formData.get("heavyTraffic"),
    vehicleSpeeding: formData.get("vehicleSpeeding"),
    improperParking: formData.get("improperParking"),
    sufficientFootpath: formData.get("sufficientFootpath"),
    visibleSignage: formData.get("visibleSignage"),
    sufficientLighting: formData.get("sufficientLighting"),
    experiencedHazard: formData.get("experiencedHazard"),
    dangerousSpot: dangerousSpot,
    recommendationText: (formData.get("recommendationText") || "").trim() || "No specific recommendation provided"
  };

  // Save to localStorage
  const existing = JSON.parse(localStorage.getItem(LOCAL_SURVEY_KEY) || "[]");
  existing.unshift(newResponse);
  localStorage.setItem(LOCAL_SURVEY_KEY, JSON.stringify(existing));

  // Reset form and UI
  form.reset();
  updateLocalSurveyCount();

  // Show Success Card & Toast
  showToast("Survey response submitted successfully!", "success", 4000);
  renderSubmissionSuccessCard(newResponse);
}

/**
 * Updates submission counter in page
 */
function updateLocalSurveyCount() {
  const counterEl = document.getElementById("local-survey-count");
  if (!counterEl) return;

  const existing = JSON.parse(localStorage.getItem(LOCAL_SURVEY_KEY) || "[]");
  counterEl.textContent = existing.length;
}

/**
 * Highlight unselected question block
 */
function highlightQuestion(fieldName) {
  const input = document.querySelector(`[name="${fieldName}"]`);
  if (input) {
    const block = input.closest(".survey-question-block");
    if (block) {
      block.scrollIntoView({ behavior: "smooth", block: "center" });
      block.style.backgroundColor = "var(--risk-high-bg)";
      block.style.borderRadius = "var(--radius-md)";
      block.style.padding = "1rem";
      setTimeout(() => {
        block.style.backgroundColor = "";
        block.style.padding = "";
      }, 2500);
    }
  }
}

/**
 * Displays an interactive receipt card of the submitted response
 */
function renderSubmissionSuccessCard(response) {
  const container = document.getElementById("submission-feedback-container");
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card" style="border-color: var(--risk-low); background: var(--bg-surface); padding: 1.5rem; margin-top: 1.5rem; animation: slideDown 250ms ease-out;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="badge badge-low">✓ Response Recorded</span>
        <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-subtle);">${response.id}</span>
      </div>
      <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
        Thank You for Contributing to Community Safety!
      </h4>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
        Your input has been recorded locally into the study dataset and will inform our GIS risk mapping and engineering recommendations.
      </p>
      <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.84rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <div><strong>Respondent:</strong> ${escapeHtml(response.respondentCategory)}</div>
        <div><strong>Transport:</strong> ${escapeHtml(response.transportMode)}</div>
        <div><strong>Safety Rating:</strong> ${escapeHtml(response.safetyRating)}</div>
        <div><strong>Hazard Spot:</strong> ${escapeHtml(response.dangerousSpot)}</div>
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="results.html" class="btn btn-sm btn-primary">View Updated Results Dashboard &rarr;</a>
        <a href="map.html" class="btn btn-sm btn-secondary">Open Safety Map &rarr;</a>
      </div>
    </div>
  `;
  container.scrollIntoView({ behavior: "smooth" });
}

/**
 * Exports all local survey responses as a JSON file
 */
function exportSurveysAsJson() {
  const localData = JSON.parse(localStorage.getItem(LOCAL_SURVEY_KEY) || "[]");
  if (localData.length === 0) {
    showToast("No locally recorded survey submissions found to export.", "warning");
    return;
  }

  const exportObj = {
    exportDate: new Date().toISOString(),
    project: "University of Mumbai CEP - Road Safety Mapping Around Schools",
    totalResponses: localData.length,
    responses: localData
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cep-survey-responses-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast(`Exported ${localData.length} responses as JSON`, "success");
}

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initSurveyEngine();
});
